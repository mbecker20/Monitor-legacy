import { StaticEffects } from "kbin-state"
import { ADD_UPDATE, REFRESH_ALL_WS, START_REFRESHING, STOP_REFRESHING } from "./updates";
import { sendOverRootWS } from "./sockets";
import { Update } from "./types/update";
import { RootState } from "./types/rootState";
import { REFRESH_ALL_CONTAINER_STATUS } from "./containers";
import { ADD_TO_COLLECTION, CREATE_COLLECTION, DELETE_COLLECTION, REMOVE_FROM_COLLECTION, TOGGLE_COL_TREE } from "./collections";
import { CREATE_DEPLOYMENT, DELETE_CONTAINER, DELETE_DEPLOYMENT, DEPLOY, navigateToDeployment, REDEPLOY, START_CONTAINER, STOP_CONTAINER } from "./deployments";
import { ADD_SERVER, navigateToServer, PRUNE_SERVER, REMOVE_SERVER, TOGGLE_SERVER_TREE } from "./servers";
import { BUILD, CREATE_BUILD, DELETE_BUILD, navigateToBuild } from "./builds";
import { navigate } from "../index"
import { createToast } from '../helpers/toaster'

export const effects: StaticEffects<RootState> = {
  /* Toasts */
  [ADD_UPDATE]: (_, { update }: { update: Update }) => {
    createToast(`${update.operation} by ${update.operator} at ${update.timestamp.time}`, update.isError ? 'danger' : 'success')
  },
  [START_REFRESHING]: () => {
    createToast('Refreshing...', 'warning')
  },
  [STOP_REFRESHING]: () => {
    createToast('Refreshed', 'success')
  },
  [REFRESH_ALL_WS]: () => {
    createToast('Refreshed all Websockets', 'success')
  },
  [CREATE_COLLECTION]: ({ collections }, { collectionID }) => {
    createToast(`Collection ${collections[collectionID].name} created`, 'success')
  },
  [DELETE_COLLECTION]: (_, { name }) => {
    createToast(`Collection ${name} deleted`, 'success')
  },
  [ADD_TO_COLLECTION]: ({ collections, deployments }, { collectionID, deploymentID }) => {
    createToast(`${deployments[deploymentID].name} added to ${collections[collectionID].name}`, 'success')
  },
  [REMOVE_FROM_COLLECTION]: ({ collections, deployments }, { collectionID, deploymentID }) => {
    createToast(`${deployments[deploymentID].name} removed from ${collections[collectionID].name}`, 'success')
  },
  [DEPLOY]: ({ deployments }, { complete, deploymentID }) => {
    if (!complete) {
      createToast(`Deploying ${deployments[deploymentID].name}...`, 'warning')
    }
  },
  [REDEPLOY]: ({ deployments }, { complete, deploymentID }) => {
    if (!complete) {
      createToast(`Redeploying ${deployments[deploymentID].name}...`, 'warning')
    }
  },
  [DELETE_CONTAINER]: ({ deployments }, { complete, deploymentID }) => {
    if (!complete) {
      createToast(`Deleting Container ${deployments[deploymentID].name}...`, 'warning')
    }
  },
  [START_CONTAINER]: ({ deployments }, { complete, deploymentID }) => {
    if (!complete) {
      createToast(`Starting ${deployments[deploymentID].name}...`, 'warning')
    }
  },
  [STOP_CONTAINER]: ({ deployments }, { complete, deploymentID }) => {
    if (!complete) {
      createToast(`Stopping ${deployments[deploymentID].name}...`, 'warning')
    }
  },
  [BUILD]: ({ builds }, { complete, buildID }) => {
    if (!complete) {
      createToast(`Building ${builds[buildID].name}...`, 'warning')
    }
  },
  [PRUNE_SERVER]: ({ servers }, { complete, serverID }) => {
    if(!complete) {
      createToast(`Pruning ${servers[serverID].name}...`, 'warning')
    }
  },
  /* Create / Delete Navigation */
  [CREATE_BUILD]: (_, { buildID }) => {
    navigateToBuild(buildID)
  },
  [DELETE_BUILD]: () => {
    navigate('/')
  },
  [CREATE_DEPLOYMENT]: (_, { deploymentID }) => {
    navigateToDeployment(deploymentID)
  },
  [DELETE_DEPLOYMENT]: () => {
    navigate('/')
  },
  [ADD_SERVER]: (_, { serverID }) => {
    navigateToServer(serverID)
  },
  [REMOVE_SERVER]: () => {
    navigate('/')
  },
  /* Misc */
  [REFRESH_ALL_CONTAINER_STATUS]: () => {
    sendOverRootWS('PONG')
  },
  PING: (state) => {
    // if (state.logWS) sendOverWS(state.logWS.socket, 'PONG')
  },
  [TOGGLE_SERVER_TREE]: ({ servers }, { serverID }) => {
    window.localStorage.setItem(`${serverID}SEREXP`, servers[serverID].expanded ? 't' : 'f')
  },
  [TOGGLE_COL_TREE]: ({ collections }, { collectionID }) => {
    window.localStorage.setItem(`${collectionID}COLEXP`, collections[collectionID].expanded ? 't' : 'f')
  },
}