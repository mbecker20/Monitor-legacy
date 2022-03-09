import { buildManager, deploymentManager, getUser, initialize, serverManager, updateManager, collectionManager, replaceNavigate } from "../index"
import { RootState } from "./types/rootState"
import { getRootWS } from './sockets'
import { objFrom2Arrays } from 'kbin-state'
import { Builds } from "./types/build"
import { GET_BUILD_UPDATES, GET_DEPLOYMENT_UPDATES, GET_SERVER_UPDATES } from "./updates"
import { initNavigateToDeployment } from "./deployments"
import { initNavigateToBuild } from "./builds"
import { SubType } from "./types/misc"
import { initNavigateToServer } from "./servers"
import { Updates } from "./types/update"
import { Collections } from "./types/collection"
import { getIDFromName } from "../helpers/general"

async function initializer(initState: RootState): Promise<RootState> {
  try {
    /* get user (sees if logged in) */
    const user = await getUser()

    const _servers = await serverManager.find(user.authenticatedParams)
    const serverIDs = Object.keys(_servers)
    const servers = _servers === 'error' ? {} : objFrom2Arrays(serverIDs, serverIDs.map(id => ({ ..._servers[id], expanded: window.localStorage.getItem(`${id}SEREXP`) === 't' ? true : false })))

    const deploymentsAndStatus = await deploymentManager.find(user.authenticatedParams)
    const { deployments, allContainerStatus } = deploymentsAndStatus && deploymentsAndStatus !== 'error' ? deploymentsAndStatus : { deployments: {}, allContainerStatus: {} }

    const _builds = await buildManager.find(user.authenticatedParams).catch(() => 'error') as Builds | 'error'
    const builds = _builds !== 'error' ? _builds : {}

    const _updates = await updateManager.find(user.authenticatedParams).catch(() => 'error') as Updates | 'error'
    const updates = _updates !== 'error' ? _updates : {}

    const _collections = await collectionManager.find(user.authenticatedParams).catch(() => 'error') as Collections | 'error'
    const collectionIDs = Object.keys(_collections)
    const collections = _collections !== 'error' ? objFrom2Arrays(collectionIDs, collectionIDs.map(id => ({ ..._collections[id], expanded: window.localStorage.getItem(`${id}COLEXP`) === 't' ? true : false }))) : {}

    const rootWS = getRootWS(user)

    // initialize the router based on incoming url
    const { last: name, firstPathStar } = initialize()

    let subbedID = ''
    let subbedType: SubType = undefined    

    if (firstPathStar === '/deployments/*') {
      subbedID = getIDFromName(name, deployments)
      subbedType = 'deployment'
      if (subbedID.length > 0) {
        rootWS.addEventListener('open', () => window.setTimeout(() => rootWS.send(JSON.stringify({ type: GET_DEPLOYMENT_UPDATES, deploymentID: subbedID, userID: user._id })), 1000))
        initNavigateToDeployment(name, subbedID)
      } else {
        replaceNavigate('/')
      }
    } else if (firstPathStar === '/builds/*') {
      subbedID = getIDFromName(name, builds)
      subbedType = 'build'
      if (subbedID.length > 0) {
        rootWS.addEventListener('open', () => window.setTimeout(() => rootWS.send(JSON.stringify({ type: GET_BUILD_UPDATES, buildID: subbedID, userID: user._id })), 1000))
        initNavigateToBuild(name, subbedID)
      } else {
        replaceNavigate('/')
      }
    } else if (firstPathStar === '/servers/*') {
      subbedID = getIDFromName(name, servers)
      subbedType = 'server'
      if (subbedID.length > 0) {
        rootWS.addEventListener('open', () => window.setTimeout(() => rootWS.send(JSON.stringify({ type: GET_SERVER_UPDATES, serverID: subbedID, userID: user._id })), 1000))
        initNavigateToServer(name, subbedID)
      } else {
        replaceNavigate('/')
      }
    }

    //await new Promise(resolve => window.setTimeout(resolve, 600)) // this is to guarantee the websocket has time to initialize
    return {
      ...initState, updates, deployments, builds, collections, allContainerStatus, servers, user, rootWS, subbed: { id: subbedID, type: subbedType }
    }
  } catch (error) {
    console.log(error)
    await new Promise(resolve => window.setTimeout(resolve, 1000)) // this is so the loading screen animation has time to initialize
    return initState
  }
}

export default initializer