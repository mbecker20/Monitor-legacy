import { Model } from "mongoose"
import { UPDATE_LIMIT } from "../const"
import UpdateManager from "../schema/Update"
import ServersManager from "../schema/Servers"
import UserManager from "../schema/User"
import { objFrom2Arrays } from "./general"
import DeploymentManager from "../schema/Deployment"
import BuildManager from "../schema/Build"
import { findServers } from "../services/servers"
import { findDeploymentsStatus } from "../services/deployments"
import { findBuilds } from "../services/builds"
import { Build } from "../types/build"
import { Application } from '../types/feathers'
import { Deployment } from "../types/deployment"

export async function getUsernamePermissions(userID: string) {
  try {
    return await UserManager.findById(userID, 'username permissions').then(
      doc => {
        return {
          username: (doc as any as User).username as string,
          permissions: (doc as any as User).permissions as number
        }
      }
    )
  } catch {
    return { username: '', permissions: 0 }
  }
  
}

export async function findByOwner(model: Model<any>, username: string, additionalIDs?: string[], postFind?: (docArray: any[]) => any[] | Promise<any[]>) {
  const docs = await model.find({ $or: [{ owner: username }, { _id: { $in: additionalIDs } }] })
  const docArray = postFind ? await postFind(docs) : docs
  return objFrom2Arrays(docArray.map(doc => doc._id), docArray)
}

export async function findFullObject(model: Model<any>) {
  const docs = await model.find({})
  return objFrom2Arrays(docs.map(doc => doc._id), docs)
}

export async function findFullWithLimit(model: Model<any>, limit: number) {
  const docs = await model.find({}).sort({ createdAt: -1 }).limit(limit)
  return objFrom2Arrays(docs.map(doc => doc._id), docs)
}

export async function findFullWithFilter(model: Model<any>, filter: any) {
  const docs = await model.find(filter)
  return objFrom2Arrays(docs.map(doc => doc._id), docs)
}

export async function findFullWithFilterLimit(model: Model<any>, filter: any, limit: number) {
  const docs = await model.find(filter).sort({ createdAt: -1 }).limit(limit)
  return objFrom2Arrays(docs.map(doc => doc._id), docs)
}

export async function getDeploymentAndServer(deploymentID: string) {
  const deployment = await DeploymentManager.findById(deploymentID) as any as Deployment
  return {
    deployment, server: await ServersManager.findById(deployment.serverID) as any as Server
  }
}

export async function getGithubListenerURL(app: Application, buildID: string) {
  const build = await BuildManager.findById(buildID, 'pullName') as any as Build
  return `https://${app.get('host')}/githubListener?pullName=${build.pullName}`
}

export async function findAllState() {
  try {
    const deploymentsAndStatus = await findDeploymentsStatus()
    const builds = await findBuilds()
    const servers = await findServers()
    const updates = await findFullWithLimit(UpdateManager, UPDATE_LIMIT)
    if (deploymentsAndStatus) {
      return {
        ...deploymentsAndStatus, builds, servers, updates
      }
    } else {
      return {
        deployments: {}, allContainerStatus: {}, builds, servers, updates
      }
    }
  } catch (err) {
    console.log('ERROR @ ROOT SOCKET')
    console.log(err)
    console.log()
    return {
      deployments: {}, 
      allContainerStatus: {},
      builds: {},
      servers: {},
      updates: {},
    }
  }
}