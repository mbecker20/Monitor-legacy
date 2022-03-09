import { addSocketWithTimeout, broadcastGivenWS } from '../main'
import { DEFAULT_INIT_SEND } from '../const'
import WebSocket, { Server } from 'ws'
import { getAllContainerStatus } from '../helpers/docker'
import serverActions from './actions/server'
import generalActions from './actions/general'
import DeploymentManager from '../schema/Deployment'
import buildActions from './actions/build'
import deploymentActions from './actions/deployment'
import collectionActions from './actions/collection'
import { getUsernamePermissions } from '../helpers/database'
import { Application } from '@feathersjs/express'
import { Deployment } from '../types/deployment'

const REFRESH_ALL_CONTAINER_STATUS = 'REFRESH_ALL_CONTAINER_STATUS'

export function addRootSocket(app: Application) {
  addSocketWithTimeout(app, '/', async () => DEFAULT_INIT_SEND, onMessage, timeout)

  async function timeout(ws: Server) {
    try {
      const deploymentsAr = await DeploymentManager.find({}) as any as Deployment[]
      broadcastGivenWS(ws, REFRESH_ALL_CONTAINER_STATUS, { allContainerStatus: await getAllContainerStatus(deploymentsAr) })
    } catch (err) {
      console.log('ROOT BROADCAST ERROR:\n')
      console.log(err)
      console.log()
    }
  }

  async function onMessage(message: any, ws: WebSocket) {
    const { type, userID } = message
    const { username, permissions } = await getUsernamePermissions(userID).catch(() => ({ username: '', permissions: 0 }))
    if (username === '') return
    await generalActions(app, ws, message, type, userID) ||
    await buildActions(ws, message, type, username, permissions) ||
    await deploymentActions(ws, message, type, username, permissions) ||
    await serverActions(ws, message, type, userID, username, permissions) ||
    await collectionActions(ws, message, type, userID)
    // this statement only runs the next group of actions if the previous one doesnt run
  }
}