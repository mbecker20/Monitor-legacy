import WebSocket from "ws"
import { DELETING, DEPLOYING, STARTING, STOPPING } from "../../helpers/actionStateManager"
import { findAllState } from "../../helpers/database"
import { getContainerStatus } from "../../helpers/docker"
import { broadcast, getDeployActionState, getMultiDeployActionState, setDeployActionState } from "../../main"
import { createDeployment, deleteContainer, deleteDeployment, deploy, startContainer, stopContainer, updateDeployment } from "../../services/deployments"
import { sendErrorOverWS } from "../websocket"
import { STOP_REFRESHING } from "./general"

const CREATE_DEPLOYMENT = 'CREATE_DEPLOYMENT'
const DELETE_DEPLOYMENT = 'DELETE_DEPLOYMENT'
const UPDATE_DEPLOYMENT = 'UPDATE_DEPLOYMENT'
const DEPLOY = 'DEPLOY'
const REDEPLOY = 'REDEPLOY'
const START_CONTAINER = 'START_CONTAINER'
const STOP_CONTAINER = 'STOP_CONTAINER'
const DELETE_CONTAINER = 'DELETE_CONTAINER'
const REFRESH_CONTAINER_STATUS = 'REFRESH_CONTAINER_STATUS'
const COPY_ENV = 'COPY_ENV'

const DEPLOY_TIMEOUT = 1000
const DEPLOY_RECHECK_TIMEOUT = 3000

async function deploymentActions(ws: WebSocket, message, type: string, username: string, permissions: number) {
  const { deploymentID, note, userID } = message
  if (username === '') return 
  switch (type) {
    case CREATE_DEPLOYMENT:
      const deployment = await createDeployment(message.deployment, username, permissions, note, message.envCopyID)
      if (deployment) {
        broadcast('/', CREATE_DEPLOYMENT, { deployment, deploymentID: deployment._id.toHexString() })
      } else {
        sendErrorOverWS(ws, 'Create Deployment Failed Serverside')
      }
      return true

    case DELETE_DEPLOYMENT:
      const res = await deleteDeployment(deploymentID, username, permissions, note)
      if (res) {
        broadcast('/', STOP_REFRESHING, { ...(await findAllState()) })
      } else {
        sendErrorOverWS(ws, 'Delete Deployment Failed Serverside')
      }
      return true

    case UPDATE_DEPLOYMENT:
      const _deployment = await updateDeployment(message.deployment, username, permissions, note)
      if (_deployment) {
        broadcast('/', UPDATE_DEPLOYMENT, { deployment: _deployment, deploymentID: message.deployment._id })
      } else {
        sendErrorOverWS(ws, 'Update Deployment Failed Serverside')
      }
      return true
    
    case DEPLOY:
      if (!getDeployActionState(deploymentID, DEPLOYING)) {
        setDeployActionState(deploymentID, DEPLOYING, true)
        broadcast('/', DEPLOY, { complete: false, deploymentID, username })
        await deploy(deploymentID, username, permissions, note)
        setTimeout(async () => {
          broadcast('/', DEPLOY, { complete: true, containerStatus: await getContainerStatus(deploymentID), containerLog: { stdout:'Started' }, deploymentID })
          setDeployActionState(deploymentID, DEPLOYING, false)
          statusCheckTimeout(deploymentID)
        }, DEPLOY_TIMEOUT)
      }
      return true
    
    case REDEPLOY:
      if (!getDeployActionState(deploymentID, DEPLOYING)) {
        setDeployActionState(deploymentID, DEPLOYING, true)
        broadcast('/', REDEPLOY, { complete: false, deploymentID, username })
        await deploy(deploymentID, username, permissions, note, true)
        setTimeout(async () => {
          broadcast('/', REDEPLOY, { complete: true, containerStatus: await getContainerStatus(deploymentID), containerLog: { stdout:'Started' }, deploymentID})
          setDeployActionState(deploymentID, DEPLOYING, false)
          statusCheckTimeout(deploymentID)
        }, DEPLOY_TIMEOUT)
      }
      return true

    case START_CONTAINER:
      if (!getMultiDeployActionState(deploymentID, [STARTING, DELETING, DEPLOYING])) {
        setDeployActionState(deploymentID, STARTING, true)
        broadcast('/', START_CONTAINER, { complete: false, deploymentID, username })
        await startContainer(deploymentID, username, permissions, note)
        setTimeout(async () => {
          broadcast('/', START_CONTAINER, { complete: true, containerStatus: await getContainerStatus(deploymentID), containerLog: { stdout:'Started' }, deploymentID })
          setDeployActionState(deploymentID, STARTING, false)
          statusCheckTimeout(deploymentID)
        }, DEPLOY_TIMEOUT)
      }
      return true
    
    case STOP_CONTAINER:
      if (!getMultiDeployActionState(deploymentID, [STOPPING, DELETING, DEPLOYING])) {
        setDeployActionState(deploymentID, STOPPING, true)
        broadcast('/', STOP_CONTAINER, { complete: false, deploymentID, username })
        await stopContainer(deploymentID, username, permissions, note)
        setTimeout(async () => {
          broadcast('/', STOP_CONTAINER, { complete: true, containerStatus: await getContainerStatus(deploymentID), deploymentID })
          setDeployActionState(deploymentID, STOPPING, false)
          statusCheckTimeout(deploymentID)
        }, DEPLOY_TIMEOUT)
      }
      return true

    case DELETE_CONTAINER:
      if (!getMultiDeployActionState(deploymentID, [DELETING, STOPPING, DEPLOYING])) {
        setDeployActionState(deploymentID, DELETING, true)
        broadcast('/', DELETE_CONTAINER, { complete: false, username, deploymentID })
        await deleteContainer(deploymentID, username, permissions, note)
        setTimeout(async () => {
          broadcast('/', DELETE_CONTAINER, { complete: true, containerStatus: await getContainerStatus(deploymentID), deploymentID })
          setDeployActionState(deploymentID, DELETING, false)
          statusCheckTimeout(deploymentID)
        }, DEPLOY_TIMEOUT)
      }
      return true

    case COPY_ENV:
      return true
      
    default:
      return false
  }
}

function statusCheckTimeout(deploymentID: string) {
  setTimeout(async () => {
    broadcast('/', REFRESH_CONTAINER_STATUS, { containerStatus: await getContainerStatus(deploymentID), deploymentID })
  }, DEPLOY_RECHECK_TIMEOUT)
}

export default deploymentActions