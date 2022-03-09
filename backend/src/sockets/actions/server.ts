import WebSocket from "ws"
import { createServer, pruneServer, removeServer, updateServer } from "../../services/servers"
import { broadcast } from "../../main"
import { sendErrorOverWS, sendOverWS } from "../websocket"
import { STOP_REFRESHING } from "./general"
import { findAllState } from "../../helpers/database"

const ADD_SERVER = 'ADD_SERVER'
const REMOVE_SERVER = 'REMOVE_SERVER'
const UPDATE_SERVER = 'UPDATE_SERVER'
const PRUNE_SERVER = 'PRUNE_SERVER'
const GET_SERVER_STATS = 'GET_SERVER_STATS'

async function serverActions(ws: WebSocket, message, type: string, userID: string, username: string, permissions: number) {
  switch (type) {
    case ADD_SERVER:
      const server = await createServer(message.server, username, permissions, message.note)
      if (server !== 'error' && server !== 'not permitted') {
        broadcast('/', ADD_SERVER, { server, serverID: server._id.toHexString() })
      } else {
        sendErrorOverWS(ws, 'Add server failed server-side', server)
      }
      return true

    case REMOVE_SERVER:
      const removed = await removeServer(message.serverID, username, permissions, message.note)
      if (removed === 'removed') {
        broadcast('/', STOP_REFRESHING, { ...(await findAllState()) })
      } else {
        sendErrorOverWS(ws, 'Remove server failed server-side')
      }
      return true

    case UPDATE_SERVER:
      const _server = await updateServer(message.server, username, permissions, message.note)
      if (_server) {
        broadcast('/', UPDATE_SERVER, { server: _server, serverID: message.server._id })
      } else {
        sendErrorOverWS(ws, 'Server update failed server-side', _server)
      }
      return true

    case PRUNE_SERVER:
      pruneServer(message.serverID, username, permissions, message.note)
      return true

    case GET_SERVER_STATS:
      // assuming getServerStats is defined to return an object
      //sendOverWS(ws, GET_SERVER_STATS, getServerStats(message.serverID))
      return true

    default:
      return false
  }
}

export default serverActions