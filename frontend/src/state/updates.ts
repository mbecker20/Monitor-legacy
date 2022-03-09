import { Action, createMidReducer, createSingleReducerBundle } from "kbin-state"
import { Update, Updates } from "./types/update"
import { RootState } from "./types/rootState"
import { SubType } from "./types/misc"

export const ADD_UPDATE = 'ADD_UPDATE'

export interface AddUpdateAction extends Action {
  update: Update, updateID: string
}

export interface SwitchSubAction extends Action {
  id: string, subType: SubType
}

export function switchSubAction(id: string, subType: SubType): SwitchSubAction  {
  return { type: SWITCH_SUB, id, subType }
}

// switch the subbed ID
export const SWITCH_SUB = 'SWITCH_SUB'
export const REFRESH_ALL_WS = 'REFRESH_ALL_WS'
export const GITHUB_LISTENER_URL = 'GITHUB_LISTENER_URL'

export const GET_DEPLOYMENT_UPDATES = 'GET_DEPLOYMENT_UPDATES'
export const GET_BUILD_UPDATES = 'GET_BUILD_UPDATES'
export const GET_SERVER_UPDATES = 'GET_SERVER_UPDATES'

export const START_REFRESHING = 'START_REFRESHING'
export const STOP_REFRESHING = 'STOP_REFRESHING'

/* Reducer */

export const updatesReducer = createMidReducer<RootState, Updates>('updates', {
  [ADD_UPDATE]: (state, { update, updateID }) => ({ [updateID]: update, ...state.updates }),
  [STOP_REFRESHING]: (_, { updates }) => updates
})

export const subbedReducer = createMidReducer<RootState, { id: string, type: string }>('subbed', {
  [SWITCH_SUB]: (_, { id, pageType }) => ({ id, type: pageType })
})

export const subbedUpdatesReducer = createMidReducer<RootState, Updates>('subbedUpdates', {
  [ADD_UPDATE]: (state, { update, updateID }) => {
    const id: string = 
      update.serverID ? update.serverID : 
      update.buildID ? update.buildID : 
      update.deploymentID ? update.deploymentID : undefined
    if (id === state.subbed.id) {
      return { [updateID]: update, ...state.subbedUpdates }
    } else {
      return state.subbedUpdates
    }
  },
  ...createSingleReducerBundle([
    GET_BUILD_UPDATES, GET_SERVER_UPDATES, GET_DEPLOYMENT_UPDATES
  ], (_, { subbedUpdates }) => subbedUpdates),
  [SWITCH_SUB]: () => ({})
})

export const refreshReducer = createMidReducer<RootState, boolean>('refreshing', {
  [START_REFRESHING]: () => true,
  [STOP_REFRESHING]: () => false
})

export const githubListenerURLReducer = createMidReducer<RootState, string>('githubListenerURL', {
  [GITHUB_LISTENER_URL]: (_, { url }) => url,
  [SWITCH_SUB]: () => ''
})