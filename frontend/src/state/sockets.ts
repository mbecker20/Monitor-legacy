import { Action, createMidReducer, createSingleReducerBundle } from "kbin-state"
import { WS_URL } from "../configureBackend/configureBackend"
import { dispatch, select } from "../index"
import { REFRESH_ALL_WS } from "./updates"
import { RootState } from "./types/rootState"
import { User } from "./types/user"
import { GET_CONTAINER_LOG } from "./containers"
import { returnAfterTimeout } from "../helpers/general"

export const RESET_ROOT_WS = 'RESET_ROOT_WS'

// export const SET_LOG_WS = 'SET_LOG_WS'

// function getLogWS(deploymentID: string) {
//   const socket = new WebSocket(LOG_WS_URL + `${select(({ deployments }) => deployments[deploymentID].containerName)}`)
//   socket.addEventListener('open', () => { })
//   socket.addEventListener('message', e => {
//     const parsed = JSON.parse(e.data)
//     dispatch({
//       type: APPEND_TO_LOG,
//       newLines: parsed.logEvents ? parsed.logEvents.map((e: any) => e.message).reduce((prev: string, curr: string) => prev + '\n' + curr) : undefined
//     } as Action)
//   })
//   return socket
// }

export function getRootWS(user: User): WebSocket {
  const rootWS = new WebSocket(WS_URL, 'upgrade')
  rootWS.addEventListener('open', () => window.setTimeout(() => sendOverWS(rootWS, 'AUTH', { accessToken: user.accessToken }), 200))
  rootWS.addEventListener('message', e => dispatch(JSON.parse(e.data)))
  rootWS.addEventListener('close', () => {
    dispatch({ type: RESET_ROOT_WS, rootWS: getRootWS(user) } as Action)
  })
  return rootWS
}

// export function setLogWS(deploymentID: string) {
//   select(state => state.logWS?.socket)?.close()
//   return {
//     type: SET_LOG_WS, deploymentID, socket: getLogWS(deploymentID)
//   }
// }

export async function refreshAllWS() {
  const { rootWS: oldRootWS, user, subbed } = select(state => state)
  oldRootWS?.close()
  // oldLogWS?.socket.close()
  const rootWS = getRootWS(user)
  if (subbed.type === 'deployment' && subbed.id.length > 0) {
    rootWS.addEventListener('open', () => {
      window.setTimeout(() => {
        sendOverWS(rootWS, GET_CONTAINER_LOG, { deploymentID: subbed.id })
      }, 300)
    })
  }
  return await returnAfterTimeout(() => {
    return {
      type: REFRESH_ALL_WS, rootWS,
      // logWS: oldLogWS ? { ...oldLogWS, socket: getLogWS(oldLogWS.deploymentID) } : undefined
    }
  }, 800)
}

export function sendOverWS(ws: WebSocket, type: string, data?: any) {
  ws.send(JSON.stringify({
    type, userID: select(state => state.user._id),
    ...data
  }))
}

export function sendOverRootWS(type: string, data?: any) {
  const ws = select(state => state.rootWS)
  if (ws) sendOverWS(ws, type, data)
}

export function sendBuildAction(type: string, buildID: string) {
  sendOverRootWS(type, { buildID })
}

export function sendDeploymentAction(type: string, deploymentID: string) {
  sendOverRootWS(type, { deploymentID })
}

/* reducers for the sockets */

// export const logWSReducer = createMidReducer<RootState, { deploymentID: string, socket: WebSocket }>('logWS', {
//   [SET_LOG_WS]: (_, logWS) => logWS,
//   [REFRESH_ALL_WS]: (_, { logWS }) => logWS
// })

export const rootWSReducer = createMidReducer<RootState, WebSocket>('rootWS', {
  ...createSingleReducerBundle([
    RESET_ROOT_WS,
    REFRESH_ALL_WS
  ], (_, { rootWS }) => rootWS)
})