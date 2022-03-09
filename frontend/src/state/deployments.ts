import { toRouterName } from "kbin-router"
import { Action, createCreateReducer, createDeleteReducer, createMergeReducer, createMidReducer, createSingleReducerBundle } from "kbin-state"
import { dispatch, navigate, select } from "../index"
import { sendOverRootWS } from "./sockets"
import { Deployment, Deployments } from "./types/deployment"
import { RootState } from "./types/rootState"
import { GET_DEPLOYMENT_UPDATES, switchSubAction } from "./updates"

export const CREATE_DEPLOYMENT = 'CREATE_DEPLOYMENT'

export interface CreateDeploymentAction extends Action {
  deploymentID: string
  deployment: Deployment
}

/* DELETE */

export const DELETE_DEPLOYMENT = 'DELETE_DEPLOYMENT'

export interface DeleteDeploymentAction extends Action {
  deploymentID: string
  name: string
}

/* UPDATE */

export const UPDATE_DEPLOYMENT = 'UPDATE_DEPLOYMENT'

export interface UpdateDeploymentAction extends Action {
  deploymentID: string
  deployment: Deployment
  name: string
}

export const DEPLOY = 'DEPLOY'
export const REDEPLOY = 'REDEPLOY'
export const START_CONTAINER = 'START_CONTAINER'
export const STOP_CONTAINER = 'STOP_CONTAINER'
export const DELETE_CONTAINER = 'DELETE_CONTAINER'

export const deploymentReducer = createMidReducer<RootState, Deployments>('deployments', {
  [CREATE_DEPLOYMENT]: createCreateReducer('deployments', 'deploymentID', 'deployment'),
  [DELETE_DEPLOYMENT]: createDeleteReducer('deployments', 'deploymentID'),
  [UPDATE_DEPLOYMENT]: createMergeReducer('deployments', 'deploymentID', 'deployment'),
  STOP_REFRESHING: (_, { deployments }) => deployments
})

export const deployingReducer = createMidReducer<RootState, boolean>('deploying', {
  ...createSingleReducerBundle([
    DEPLOY, 
    REDEPLOY, 
    DELETE_CONTAINER,
    START_CONTAINER,
    STOP_CONTAINER
  ], ({ deploying, subbed }, { complete, deploymentID }) => subbed.id === deploymentID ? !complete : deploying)
})

export function initNavigateToDeployment(name: string, deploymentID: string) {
  dispatch(switchSubAction(deploymentID, 'deployment'))
  sendOverRootWS(GET_DEPLOYMENT_UPDATES, { deploymentID })
  navigate(`/deployments/${toRouterName(name)}`)
}

export function navigateToDeployment(deploymentID: string) {
  if (deploymentID !== select(state => state.subbed.id)) {
    initNavigateToDeployment(select(state => state.deployments[deploymentID].name), deploymentID)
  }
}