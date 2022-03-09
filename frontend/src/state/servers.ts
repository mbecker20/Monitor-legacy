import { Action, createDeleteReducer, createMergeReducer, createMidReducer, objFrom2Arrays } from "kbin-state";
import { GET_SERVER_UPDATES, STOP_REFRESHING, switchSubAction } from "./updates";
import { RootState } from "./types/rootState";
import { Server, Servers } from "./types/server";
import { CREATE_DEPLOYMENT, DELETE_DEPLOYMENT } from "./deployments";
import { dispatch, navigate, select } from "../index";
import { sendOverRootWS } from "./sockets";
import { toRouterName } from "kbin-router";

/* Add server */

export const ADD_SERVER = 'ADD_SERVER'

export interface AddServerAction extends Action {
  serverID: string
  server: Server
}

/* Remove server */

export const REMOVE_SERVER = 'REMOVE_SERVER'

export interface RemoveServerAction extends Action {
  serverID: string
}

/* Update Server */

export const UPDATE_SERVER = 'UPDATE_SERVER'

export interface UpdateServerAction extends Action {
  serverID: string
  server: Partial<Server>
}

/* Prune Server */
export const PRUNE_SERVER = 'PRUNE_SERVER'

export interface PruneServerAction extends Action {
  serverID: string
}

export const TOGGLE_SERVER_TREE = 'TOGGLE_SERVER_TREE'

export function toggleServerTree(serverID: string) {
  return { type: TOGGLE_SERVER_TREE, serverID }
}

/* Reducer */

export const serversReducer = createMidReducer<RootState, Servers>('servers', {
  [ADD_SERVER]: (state, { server, serverID }) => {
    return {
      ...state.servers,
      [serverID]: {
        ...server,
        expanded: true
      }
    }
  },
  [REMOVE_SERVER]: createDeleteReducer('servers', 'serverID'),
  [UPDATE_SERVER]: createMergeReducer('servers', 'serverID', 'server'),
  [STOP_REFRESHING]: (state, { servers }) => {
    const serverIDs = Object.keys(servers)
    return objFrom2Arrays(serverIDs, serverIDs.map(id => ({ ...servers[id], expanded: state.servers[id].expanded })))
  },
  [TOGGLE_SERVER_TREE]: ({ servers }, { serverID }) => {
    return {
      ...servers,
      [serverID]: {
        ...servers[serverID],
        expanded: !servers[serverID].expanded
      }
    }
  },
  [CREATE_DEPLOYMENT]: ({ servers }, { deployment }) => {
    return {
      ...servers,
      [deployment.serverID]: {
        ...servers[deployment.serverID],
        deploymentIDs: [...servers[deployment.serverID].deploymentIDs, deployment._id]
      }
    }
  },
  [DELETE_DEPLOYMENT]: ({ servers, deployments }, { deploymentID }) => {
    const serverID = deployments[deploymentID].serverID
    return {
      ...servers,
      [serverID]: {
        ...servers[serverID],
        deploymentIDs: servers[serverID].deploymentIDs.filter(id => id !== deploymentID)
      }
    }
  }
})

export function initNavigateToServer(name: string, serverID: string) {
  dispatch(switchSubAction(serverID, 'server'))
  sendOverRootWS(GET_SERVER_UPDATES, { serverID })
  navigate(`/servers/${toRouterName(name)}`)
}

export function navigateToServer(serverID: string) {
  if (serverID !== select(state => state.subbed.id)) {
    initNavigateToServer(select(state => state.servers[serverID].name), serverID)
  }
}