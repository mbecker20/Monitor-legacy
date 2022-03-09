import { Application } from "@feathersjs/express"
import WebSocket from "ws"
import { UPDATE_LIMIT } from "../../const"
import { findAllState, findFullWithFilterLimit, getGithubListenerURL } from "../../helpers/database"
import { getAllContainerStatus, getContainerLog, getContainerStatus } from "../../helpers/docker"
import DeploymentManager from "../../schema/Deployment"
import UpdateManager from "../../schema/Update"
import { Deployment } from "../../types/deployment"
import { sendOverWS } from "../websocket"

const REFRESH = 'REFRESH'
const REFRESH_ALL_CONTAINER_STATUS = 'REFRESH_ALL_CONTAINER_STATUS'
const REFRESH_CONTAINER_STATUS = 'REFRESH_CONTAINER_STATUS'
const START_REFRESHING = 'START_REFRESHING'
export const STOP_REFRESHING = 'STOP_REFRESHING'
const GITHUB_LISTENER_URL = 'GITHUB_LISTENER_URL'
const GET_BUILD_UPDATES = 'GET_BUILD_UPDATES'
const GET_DEPLOYMENT_UPDATES = 'GET_DEPLOYMENT_UPDATES'
const GET_SERVER_UPDATES = 'GET_SERVER_UPDATES'
const GET_CONTAINER_LOG = 'GET_CONTAINER_LOG'

async function generalActions(app: Application, ws: WebSocket, message, type: string, userID: string) {
  switch (type) {
    case REFRESH:
      sendOverWS(ws, START_REFRESHING)
      sendOverWS(ws, STOP_REFRESHING, await findAllState())
      return true

    case REFRESH_ALL_CONTAINER_STATUS:
      const deploymentsAr = await DeploymentManager.find({}) as any as Deployment[]
      sendOverWS(ws, REFRESH_ALL_CONTAINER_STATUS, { allContainerStatus: await getAllContainerStatus(deploymentsAr) })
      return true

    case REFRESH_CONTAINER_STATUS:
      sendOverWS(ws, REFRESH_CONTAINER_STATUS, { containerStatus: await getContainerStatus(message.deploymentID) })
      return true
    
    case GITHUB_LISTENER_URL:
      sendOverWS(ws, GITHUB_LISTENER_URL, { url: await getGithubListenerURL(app, message.buildID) })
      return true

    case GET_BUILD_UPDATES:
      sendOverWS(ws, GET_BUILD_UPDATES, { subbedUpdates: await findFullWithFilterLimit(UpdateManager, { buildID: message.buildID }, UPDATE_LIMIT) })
      return true

    case GET_DEPLOYMENT_UPDATES:
      sendOverWS(ws, GET_DEPLOYMENT_UPDATES, { subbedUpdates: await findFullWithFilterLimit(UpdateManager, { deploymentID: message.deploymentID }, UPDATE_LIMIT) })
      return true

    case GET_SERVER_UPDATES:
      sendOverWS(ws, GET_SERVER_UPDATES, { subbedUpdates: await findFullWithFilterLimit(UpdateManager, { serverID: message.serverID }, UPDATE_LIMIT) })
      return true

    case GET_CONTAINER_LOG:
      sendOverWS(ws, GET_CONTAINER_LOG, { containerLog: await getContainerLog(message.deploymentID, message.logTail).catch(err => err) })
      return true

    default:
      return false
  }
}

export default generalActions