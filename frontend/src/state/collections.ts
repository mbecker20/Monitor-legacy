import { createCreateReducer, createDeleteReducer, createMidReducer, createPullReducer, createPushReducer } from "kbin-state"
import { Collections } from "./types/collection"
import { RootState } from "./types/rootState"

export const CREATE_COLLECTION = 'CREATE_COLLECTION'
export const DELETE_COLLECTION = 'DELETE_COLLECTION'
export const ADD_TO_COLLECTION = 'ADD_TO_COLLECTION'
export const REMOVE_FROM_COLLECTION = 'REMOVE_FROM_COLLECTION'
export const TOGGLE_COL_TREE = 'TOGGLE_COL_TREE'

const createReducer = createCreateReducer<RootState, Collections>('collections', 'collectionID', 'collection')
const deleteReducer = createDeleteReducer<RootState, Collections>('collections', 'collectionID')
const pushReducer = createPushReducer<RootState, Collections>('collections', 'deploymentIDs', 'collectionID', 'deploymentID')
const pullReducer = createPullReducer<RootState, Collections>('collections', 'deploymentIDs', 'collectionID', 'deploymentID')

export function toggleColTree(collectionID: string) {
  return { type: TOGGLE_COL_TREE, collectionID }
}

export const collectionsReducer = createMidReducer<RootState, Collections>('collections', {
  [CREATE_COLLECTION]: (state, action) => {
    if (action.userID === state.user._id) {
      return createReducer(state, action)
    } else {
      return state.collections
    }
  },
  [DELETE_COLLECTION]: (state, action) => {
    if (action.userID === state.user._id) {
      return deleteReducer(state, action)
    } else {
      return state.collections
    }
  },
  [ADD_TO_COLLECTION]: (state, action) => {
    if (action.userID === state.user._id) {
      return pushReducer(state, action)
    } else {
      return state.collections
    }
  },
  [REMOVE_FROM_COLLECTION]: (state, action) => {
    if (action.userID === state.user._id) {
      return pullReducer(state, action)
    } else {
      return state.collections
    }
  },
  [TOGGLE_COL_TREE]: ({ collections }, { collectionID }) => {
    return {
      ...collections,
      [collectionID]: {
        ...collections[collectionID],
        expanded: !collections[collectionID].expanded
      }
    }
  }
})