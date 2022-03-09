import { createRootReducer } from "kbin-state"
import { githubListenerURLReducer, refreshReducer, subbedReducer, subbedUpdatesReducer, updatesReducer } from "./updates"
import { serversReducer } from "./servers"
import { rootWSReducer } from "./sockets"
import { RootState } from "./types/rootState"
import { deployingReducer, deploymentReducer } from "./deployments"
import { buildingReducer, buildReducer } from "./builds"
import { containerLogReducer, containerStatusReducer } from "./containers"
import { collectionsReducer } from "./collections"

const INIT_STATE: RootState = {
  user: {
    _id: '',
    username: '',
    permissions: 0,
    authenticatedParams: {
      query: { userID: '' },
      headers: { Authorization: '' },
    },
    accessToken: '',
  },
  updates: {},
  subbed: {
    id: '',
    type: undefined
  },
  subbedUpdates: {},
  builds: {},
  deployments: {},
  servers: {},
  collections: {},
  allContainerStatus: {},
  refreshing: false,
  containerLog: {},
  deploying: false,
  building: false,
  githubListenerURL: ''
}

const rootReducer = createRootReducer<RootState>(INIT_STATE, {
  user: (state, _) => state.user,
  builds: buildReducer,
  deployments: deploymentReducer,
  servers: serversReducer,
  allContainerStatus: containerStatusReducer,
  refreshing: refreshReducer,
  updates: updatesReducer,
  collections: collectionsReducer,
  subbed: subbedReducer,
  subbedUpdates: subbedUpdatesReducer,
  rootWS: rootWSReducer,
  // logWS: logWSReducer,
  containerLog: containerLogReducer,
  deploying: deployingReducer,
  building: buildingReducer,
  githubListenerURL: githubListenerURLReducer
})

export default rootReducer