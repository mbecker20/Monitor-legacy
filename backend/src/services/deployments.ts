import { Types } from "mongoose"
import DeploymentManager from "../schema/Deployment"
import { getDeploymentAndServer } from "../helpers/database"
import { objectLength, objFrom2Arrays, toContainerName, toFolderName, toPullName } from "../helpers/general"
import { addDeployActionState } from '../main'
import { addDeploymentUpdate, addSystemUpdate } from "../helpers/updates"
import { PERMISSIONS_DENY_LOG, REGISTRY_URL, REGISTRY_URL_EXT, SYSTEM_SERVER_NAME } from "../const"
import ServersManager from "../schema/Servers"
import { execute } from "../helpers/execute"
import BuildManager from "../schema/Build"
import { createDockerRun, getAllContainerStatus } from "../helpers/docker"
import { ProtoDeployment, Deployment } from "../types/deployment"
import { Build } from "../types/build"
import { deploymentChangelog } from "../helpers/changelogs"

// these describe the update, so are readable strings
export const CREATE_DEPLOYMENT = 'Create Deployment'
const DELETE_DEPLOYMENT = 'Delete Deployment'
const UPDATE_DEPLOYMENT = 'Update Deployment'
const DEPLOY_CONTAINER = 'Deploy'
const REDEPLOY = 'Redeploy'
//const AUTO_REDEPLOY = 'Auto Redeploy'
const START_CONTAINER = 'Start Container'
const STOP_CONTAINER = 'Stop Container'
const DELETE_CONTAINER = 'Delete Container'

const deploymentViewFields = [
  'name', 'image', 'ports', 'volumes', 'environment', 'network', 
  'logToAWS', 'useServerRoot', 'restart',
  'autoDeploy'
] // the fields shown in the update log

export async function findDeploymentsStatus() {
  try {
    const deploymentAr = await DeploymentManager.find({}) as any as Deployment[]
    const ids = deploymentAr.map(deployment => deployment._id.toHexString()) as string[]
    const deployments = objFrom2Arrays(ids, deploymentAr)
    return {
      deployments,
      allContainerStatus: await getAllContainerStatus(deploymentAr as any[])
    }
  } catch (err) {
    console.log('FIND DEPLOYMENTS ERROR')
    console.log(err)
    console.log()
    return {
      deployments: {},
      allContainerStatus: {}
    }
  }
}

export async function createDeployment(deployment: ProtoDeployment, username: string, permissions: number, note: string, envCopyID?: string) {
  if (permissions >= 1) {
    try {
      const _id = new Types.ObjectId()
      const idString = _id.toHexString()
      const server = await ServersManager.findOneAndUpdate({ _id: deployment.serverID }, {
        $push: { deploymentIDs: idString }
      }) as any as Server
      const build = deployment.buildID ? await BuildManager.findById(deployment.buildID) as any as Build : undefined
      const _deployment = await DeploymentManager.create({ 
        ...deployment, _id, 
        folderName: toPullName(deployment.name), 
        containerName: toContainerName(deployment.name),
        image: (
          deployment.image ? deployment.image :
            build ?
            (server.name === SYSTEM_SERVER_NAME ? 
            REGISTRY_URL : REGISTRY_URL_EXT) + build.imageName : undefined
        ),
      }) as any as Deployment
      addDeployActionState(idString)
      addDeploymentUpdate(
        _id, CREATE_DEPLOYMENT, 'Create Deployment', 
        { stdout: 'Deployment Created: ' + deployment.name }, 
        username, note
      )
      return _deployment
    } catch (err) {
      addSystemUpdate(
        CREATE_DEPLOYMENT, 'Create Deployment', 
        { stderr: JSON.stringify(err) }, username, note, true
      )
    }
  } else {
    addSystemUpdate(CREATE_DEPLOYMENT, 'Create Deployment', PERMISSIONS_DENY_LOG, username, note, true)
  }
}

export async function deleteDeployment(deploymentID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const deployment = await DeploymentManager.findByIdAndDelete(deploymentID) as any as Deployment
      const server = await ServersManager.findByIdAndUpdate(deployment.serverID, {
        $pull: { deploymentIDs: deploymentID }
      }) as any as Server
      let stopLog: Log = {}
      if (deployment.image) {
        try {
          stopLog = (await execute(`docker stop ${deployment.containerName} && docker container rm ${deployment.containerName}`, server)).log
        } catch {}
      }
      addSystemUpdate(
        DELETE_DEPLOYMENT, 'Delete Deployment',
        {
          stdout: (
            'Removed:\n\n' + deploymentViewFields.map(field => {
              return `${field}: ${JSON.stringify(deployment[field])}\n`
            }).reduce((prev, curr) => prev + curr) +
            (objectLength(stopLog) > 0 ? `\n\nDocker Stop Log:\n\n${stopLog}` : '')
          )
        }, username, note
      )
      return true
    } catch (err) {
      addSystemUpdate(DELETE_DEPLOYMENT, 'Delete Deployment', { stderr: JSON.stringify(err) }, username, note, true)
    }
  } else {
    addSystemUpdate(DELETE_DEPLOYMENT, 'Delete Deployment', PERMISSIONS_DENY_LOG, username, note, true)
  }
}

export async function updateDeployment(deployment: Deployment, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const _id = new Types.ObjectId(deployment._id as any as string)
      const preDeployment = await DeploymentManager.findById(_id) as any
      if (deployment.name !== preDeployment.name) {
        // RENAME DEPLOY DATA FOLDER MOVE
        deployment.folderName = toFolderName(deployment.name)
        deployment.containerName = toContainerName(deployment.name)
        // the following must be changed to take place on the deployment server (right now this would happen on monitor server). maybe test mv command with execute.
        // if (pathExistsSync(ROOT + DEPLOYDATA_ROOT + preDeployment.folderName)) {
        //   moveSync(
        //     ROOT + DEPLOYDATA_ROOT + preDeployment.folderName, 
        //     ROOT + DEPLOYDATA_ROOT + deployment.folderName
        //   )
        // }
      }
      // if (deployment.buildID !== preDeployment.buildID) {
      //   const build = deployment.buildID ? await BuildManager.findById(deployment.buildID) as any as Build : undefined
      //   if (build) {
      //     const server = await ServersManager.findById(preDeployment.serverID) as any as Server
      //     deployment.image = (server.name === SYSTEM_SERVER_NAME ? REGISTRY_URL : REGISTRY_URL_EXT) + build.imageName
      //   }
      // }
      await DeploymentManager.updateOne({ _id }, deployment)
      await addDeploymentUpdate(
        _id, UPDATE_DEPLOYMENT, 'Update Deployment',
        {
          stdout: deploymentChangelog(preDeployment, deployment)
        },
        username, note
      )
      return deployment
    } catch (err) {
      addSystemUpdate(UPDATE_DEPLOYMENT, 'Update Deployment', { stderr: JSON.stringify(err) }, username, note, true)
    }
  } else {
    addSystemUpdate(UPDATE_DEPLOYMENT, 'Update Deployment', PERMISSIONS_DENY_LOG, username, note, true)
  }
}

export async function deploy(deploymentID: string, username: string, permissions: number, note: string, redeploy?: boolean) {
  if (permissions >= 1) {
    try {
      const { deployment, server } = await getDeploymentAndServer(deploymentID)
      const { _id, containerName } = deployment
      const stopCommand = `docker stop ${containerName} && docker container rm ${containerName}`
      await execute(stopCommand, server)
      const deployCommand = await createDockerRun(deployment, server)
      const { log, success } = await execute(deployCommand, server)
      addDeploymentUpdate(
        _id, redeploy ? REDEPLOY : DEPLOY_CONTAINER, deployCommand, log, username, note, !success
      )
    } catch (err) {
      addSystemUpdate(
        redeploy ? REDEPLOY : DEPLOY_CONTAINER,
        'Deploy (ERROR)', {
          stderr: JSON.stringify(err)
        },
        username, note, true
      )
    }
  } else {
    addSystemUpdate(
      redeploy ? REDEPLOY : DEPLOY_CONTAINER, 'Deploy (DENIED)', 
      PERMISSIONS_DENY_LOG, username, note, true
    )
  }
}

export async function startContainer(deploymentID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const { deployment, server } = await getDeploymentAndServer(deploymentID)
      const startCommand = `docker start ${deployment.containerName}`
      const { log, success } = await execute(startCommand, server)
      addDeploymentUpdate(
        deployment._id, START_CONTAINER, startCommand, log, username, note, !success
      )
    } catch (err) {
      addSystemUpdate(
        START_CONTAINER, 'Start Container (ERROR)', { stderr: JSON.stringify(err) } , username, note, true
      )
    }
  } else {
    addSystemUpdate(
      START_CONTAINER, 'Start Container (DENIED)', 
      PERMISSIONS_DENY_LOG, username, note, true
    )
  }
}

export async function stopContainer(deploymentID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const { deployment, server } = await getDeploymentAndServer(deploymentID)
      const stopCommand = `docker stop ${deployment.containerName}`
      const { log, success } = await execute(stopCommand, server)
      addDeploymentUpdate(
        deployment._id, STOP_CONTAINER, stopCommand, log, username, note, !success
      )
    } catch (err) {
      addSystemUpdate(
        STOP_CONTAINER, 'Stop Container (ERROR)', { stderr: JSON.stringify(err) } , username, note, true
      )
    }
  } else {
    addSystemUpdate(
      STOP_CONTAINER, 'Stop Container (DENIED)', 
      PERMISSIONS_DENY_LOG, username, note, true
    )
  }
}

export async function deleteContainer(deploymentID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const { serverID, containerName, _id } = await DeploymentManager.findById(deploymentID) as any as Deployment
      const server = await ServersManager.findById(serverID) as any as Server
      const deleteCommand = `docker stop ${containerName} && docker container rm ${containerName}`
      const { log, success } = await execute(deleteCommand, server)
      addDeploymentUpdate(
        _id, DELETE_CONTAINER, deleteCommand, log, username, note, !success
      )
    } catch (err) {
      addSystemUpdate(DELETE_CONTAINER, 'Delete Container (ERROR)', { stderr: JSON.stringify(err) }, username, note, true)
    }
  } else {
    addSystemUpdate(DELETE_CONTAINER, 'Delete Container (DENIED)', PERMISSIONS_DENY_LOG, username, note, true)
  }
}