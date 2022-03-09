import WebSocket from "ws"
import { BUILDING, PULLING } from "../../helpers/actionStateManager"
import { findAllState } from "../../helpers/database"
import { broadcast, getBuildActionState, setBuildActionState } from "../../main"
import { createBuild, deleteBuild, pull, updateBuild, runBuild } from "../../services/builds"
import { sendErrorOverWS, sendOverWS } from "../websocket"
import { STOP_REFRESHING } from './general'

const CREATE_BUILD = 'CREATE_BUILD'
const DELETE_BUILD = 'DELETE_BUILD'
const UPDATE_BUILD = 'UPDATE_BUILD'
const PULL = 'PULL'
const BUILD = 'BUILD'

async function buildActions(ws: WebSocket, message, type: string, username: string, permissions: number) {
  const { buildID, note, userID } = message
  if (username === '') return true
  switch (type) {
    case CREATE_BUILD:
      const build = await createBuild(message.build, username, permissions, note)
      if (build) {
        broadcast('/', CREATE_BUILD, { build, buildID: build._id.toHexString() })
      } else {
        sendErrorOverWS(ws, 'Create build failed server-side')
      }
      return true

    case DELETE_BUILD:
      const res = await deleteBuild(buildID, username, permissions, note)
      if (res) {
        broadcast('/', STOP_REFRESHING, await findAllState())
      } else {
        sendErrorOverWS(ws, 'Delete build failed server-side')
      }
      return true

    case UPDATE_BUILD:
      const _build = await updateBuild(message.build, username, permissions, note)
      if (_build) {
        broadcast('/', UPDATE_BUILD, { build: _build, buildID: message.build._id })
      } else {
        sendErrorOverWS(ws, 'Update build failed server-side')
      }
      return true

    case PULL:
      if (!getBuildActionState(buildID, PULLING)) {
        setBuildActionState(buildID, PULLING, true)
        broadcast('/', PULL, { complete: false, buildID })
        await pull(buildID, username, permissions, note)
        broadcast('/', PULL, { complete: true, buildID })
        setBuildActionState(buildID, PULLING, false)
      }
      return true

    case BUILD:
      if (!getBuildActionState(buildID, BUILDING)) {
        setBuildActionState(buildID, BUILDING, true)
        broadcast('/', BUILD, { complete: false, buildID })
        await runBuild(buildID, username, permissions, note)
        broadcast('/', BUILD, { complete: true, buildID })
        setBuildActionState(buildID, BUILDING, false)
      }
      return true

    default:
      return false
  }
}

export default buildActions