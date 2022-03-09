import { moveSync, pathExistsSync, remove } from "fs-extra"
import { Types } from "mongoose"
import { PERMISSIONS_DENY_LOG, REGISTRY_URL, REGISTRY_URL_EXT, REPO_PATH, SYSTEM_SERVER_NAME } from "../const"
import { addBuildActionState } from "../main"
import BuildManager from "../schema/Build"
import { findFullObject } from "../helpers/database"
import { createDockerBuild } from "../helpers/docker"
import { executeLocal } from "../helpers/execute"
import { combineLogs, getRepositoryName, isValidRepoURL, toContainerName, toImageName, toPullName } from "../helpers/general"
import { addBuildUpdate, addSystemUpdate } from "../helpers/updates"
import DeploymentManager from "../schema/Deployment"
import ServersManager from "../schema/Servers"
import { Build, ProtoBuild } from "../types/build"
import { Deployment } from "../types/deployment"
import { buildChangelog } from "../helpers/changelogs"

export const CREATE_BUILD = "Create Build"
const DELETE_BUILD = "Delete Build"
const UPDATE_BUILD = "Update Build"
export const CLONE = "Clone"
const PULL = "Pull"
const RECLONE = "Reclone"
export const RUN_BUILD = "Build"

const buildViewFields = ["name", "repoURL", "repoName", "branch", "buildPath", "dockerfilePath", "owner"] // the fields shown in the update log

export async function findBuilds() {
	return await findFullObject(BuildManager)
}

export async function createBuild(_build: ProtoBuild, username: string, permissions: number, note: string) {
	if (permissions >= 1) {
		try {
			const build = (await BuildManager.create({
				..._build,
				pullName: toPullName(_build.name),
				imageName: toContainerName(_build.name),
			})) as any as Build
			addBuildUpdate(build._id, CREATE_BUILD, "Create Build", { stdout: "Build Created: " + _build.name }, username, note)
			addBuildActionState(build._id.toHexString())
			if (build.repoURL) {
				await cloneRepo(build._id, build, username, "")
			}
			return build as any as Build
		} catch (err) {
			addSystemUpdate(CREATE_BUILD, "Create Build (ERROR)", { stderr: JSON.stringify(err) }, username, note, true)
		}
	} else {
		addSystemUpdate(CREATE_BUILD, "Create Build (DENIED)", PERMISSIONS_DENY_LOG, username, note, true)
	}
}

export async function deleteBuild(buildID: string, username: string, permissions: number, note: string) {
	if (permissions >= 1) {
		try {
			const build = (await BuildManager.findByIdAndDelete(buildID)) as any as Build
			await remove(REPO_PATH + build.pullName).catch(() => {})
			await DeploymentManager.updateMany({ buildID: build._id }, { buildID: undefined })
			addSystemUpdate(
				DELETE_BUILD,
				"Delete Build",
				{
					stdout:
						"Removed:\n\n" +
						buildViewFields
							.filter((field) => build[field] || build[field] === 0)
							.map((field) => {
								return `${field}: ${JSON.stringify(build[field])}\n`
							})
							.reduce((prev, curr) => prev + curr),
				},
				username,
				note
			)
			return true
		} catch (err) {
			addSystemUpdate(
				DELETE_BUILD,
				"Delete Build (ERROR)",
				{
					stderr: err as string,
				},
				username,
				note,
				true
			)
		}
	} else {
		addSystemUpdate(DELETE_BUILD, "Delete Build (DENIED)", PERMISSIONS_DENY_LOG, username, note, true)
	}
}

export async function updateBuild(build: Build, username: string, permissions: number, note: string) {
	if (permissions >= 1) {
		try {
			const _id = new Types.ObjectId(build._id as any as string)
			//const update = mergeNullableIntoUpdate(build)
			const preBuild = (await BuildManager.findById(_id)) as any as Build
			if (build.name !== preBuild.name) {
				// ON RENAME BUILD -> CORRESPONDING REPO FOLDER MOVE
				build.imageName = toImageName(build.name)
				build.pullName = toPullName(build.name)
				if (pathExistsSync(REPO_PATH + preBuild.pullName)) {
					moveSync(REPO_PATH + preBuild.pullName, REPO_PATH + build.pullName)
				}
				// find all deployments using this build and rename their image
				const deployments = (await DeploymentManager.find({ buildID: build._id })) as any as Deployment[]
				deployments.forEach(async (deployment) => {
					const server = (await ServersManager.findById(deployment.serverID)) as any as Server
					await DeploymentManager.updateOne(
						{ _id: deployment._id },
						{
							image: (server.name === SYSTEM_SERVER_NAME ? REGISTRY_URL : REGISTRY_URL_EXT) + build.imageName,
						}
					)
				})
			}

			await addBuildUpdate(
				_id,
				UPDATE_BUILD,
				"Update Build",
				{
					stdout: buildChangelog(preBuild, build),
				},
				username,
				note
			)
			if (build.repoURL && build.repoURL !== preBuild.repoURL) {
				// reclone repo if url is changed
				await cloneRepo(build._id, build, username, "", true)
				build.repoName = getRepositoryName(build.repoURL)
			}
			await BuildManager.updateOne({ _id }, build)
			return build
		} catch (err) {
			addSystemUpdate(
				UPDATE_BUILD,
				"Update Build (ERROR)",
				{
					stderr: JSON.stringify(err),
				},
				username,
				note,
				true
			)
		}
	} else {
		addSystemUpdate(UPDATE_BUILD, "Update Build (DENIED)", PERMISSIONS_DENY_LOG, username, note, true)
	}
}

export async function cloneRepo(buildID: Types.ObjectId, { repoURL, branch, pullName }: Build, username: string, note: string, reclone?: boolean) {
	await remove(REPO_PATH + pullName).catch()
	const cloneForLog = !branch || branch === "master" ? `git clone https://<TOKEN>@github.com/${repoURL}.git ${REPO_PATH}${pullName}` : `git clone https://<TOKEN>@github.com/${repoURL}.git ${REPO_PATH}${pullName} -b ${branch}`
	const clone = !branch || branch === "master" ? `git clone https://${process.env.GH_ACCESS_TOKEN}@github.com/${repoURL}.git ${REPO_PATH}${pullName}` : `git clone https://${process.env.GH_ACCESS_TOKEN}@github.com/${repoURL}.git ${REPO_PATH}${pullName} -b ${branch}`
	const { log, success } = await executeLocal(clone)
	addBuildUpdate(buildID, reclone ? RECLONE : CLONE, cloneForLog, log, username, note, !success)
}

export async function pull(buildID: string, username: string, permissions: number, note: string) {
	try {
		if (permissions >= 1) {
			const build = (await BuildManager.findById(buildID)) as any as Build
			const { _id, pullName, branch } = build
			const pullCommand = `cd ${REPO_PATH}${pullName} && git pull origin ${branch ? branch : "master"}`
			const { log, success } = await executeLocal(pullCommand)
			addBuildUpdate(_id, PULL, pullCommand, log, username, note, !success)
		} else {
			return "not permitted"
		}
	} catch (err) {
		addSystemUpdate(PULL, "Repo Pull (ERROR)", { stderr: err as string }, username, note, true)
		return "error"
	}
}

export async function runBuild(buildID: string, username: string, permissions: number, note: string) {
	try {
		if (permissions >= 1) {
			const build = (await BuildManager.findById(buildID)) as any as Build
			const { _id, pullName, branch } = build
			const pullCommand = `cd ${REPO_PATH}${pullName} && git pull origin ${branch ? branch : "master"}`
			const { log: pullLog } = await executeLocal(pullCommand)
			const buildCommand = createDockerBuild(build)
			const { log, success } = await executeLocal(buildCommand)
			addBuildUpdate(_id, RUN_BUILD, `Pull Command: ${pullCommand},\nBuild Command: ${buildCommand}`, combineLogs(pullLog, log), username, note, !success)
		} else {
			return "not permitted"
		}
	} catch (err) {
		addSystemUpdate(RUN_BUILD, "Build (ERROR)", { stderr: err as string }, username, note, true)
		return "error"
	}
}
