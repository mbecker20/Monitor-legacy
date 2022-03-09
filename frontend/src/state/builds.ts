import { toRouterName } from "kbin-router"
import { Action, createCreateReducer, createMergeReducer, createMidReducer } from "kbin-state"
import { dispatch, navigate, select } from "../index"
import { sendOverRootWS } from "./sockets"
import { Build, Builds } from "./types/build"
import { RootState } from "./types/rootState"
import { GET_BUILD_UPDATES, switchSubAction } from "./updates"

export const CREATE_BUILD = 'CREATE_BUILD'

export interface CreateBuildAction extends Action {
  buildID: string
  build: Build
}

/* DELETE */

export const DELETE_BUILD = 'DELETE_BUILD'

export interface DeleteBuildAction extends Action {
  buildID: string
}

/* UPDATE */

export const UPDATE_BUILD = 'UPDATE_BUILD'

export interface UpdateBuildAction extends Action {
  buildID: string
  build: Build
}

export const PULL = 'PULL'
export const BUILD = 'BUILD'

export const buildReducer = createMidReducer<RootState, Builds>('builds', {
  [CREATE_BUILD]: createCreateReducer('builds', 'buildID', 'build'),
  [UPDATE_BUILD]: createMergeReducer('builds', 'buildID', 'build'),
  STOP_REFRESHING: (_, { builds }) => builds
})

export const buildingReducer = createMidReducer<RootState, boolean>('building', {
  [BUILD]: ({ building, subbed }, { complete, buildID }) => subbed.id === buildID ? !complete : building
})

export function initNavigateToBuild(name: string, buildID: string) {
  dispatch(switchSubAction(buildID, 'build'))
  sendOverRootWS(GET_BUILD_UPDATES, { buildID })
  navigate(`/builds/${toRouterName(name)}`)
}

export function navigateToBuild(buildID: string) {
  if (buildID !== select(state => state.subbed.id)) {
    initNavigateToBuild(select(state => state.builds[buildID].name), buildID)
  }
}