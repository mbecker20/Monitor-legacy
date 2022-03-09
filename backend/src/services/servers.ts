import ServersManager from "../schema/Servers"
import { Types } from 'mongoose'
import { PERMISSIONS_DENY_LOG, SERVER_CHECK_TIMEOUT, SYSTEM_OPERATOR, SYSTEM_SERVER_NAME, UNAUTHORIZED_ATTEMPT, PRUNE_SERVER } from "../const"
import { objFrom2Arrays } from "../helpers/general"
import { addServerUpdate, addSystemUpdate } from "../helpers/updates"
import { deleteDeployment } from "./deployments"
import AbortController from "abort-controller"
import fetch from "node-fetch"
import { serverChangelog } from "../helpers/changelogs"
import { execute } from "../helpers/execute"

const ADD_SERVER = 'Server Add'
const REMOVE_SERVER = 'Server Remove'
const UPDATE_SERVER = 'Server Update'
const PRUNE_COMMAND = 'docker image prune -a -f'

export async function findServers() {
  try {
    const serversAr = await ServersManager.find({}) as any as Server[]
    return objFrom2Arrays(
      serversAr.map(server => server._id.toHexString()),
      await Promise.all(serversAr.map(async server => {
        try {
          return Object.assign(server, { status: await checkServerStatus(server) })
        } catch (err) {
          console.log('ERROR')
          console.log(err)
          console.log()
          return Object.assign(server, { status: 'Could Not Be Reached' })
        }
      }))
    )
  } catch (err) {
    console.log('ERROR')
    console.log(err)
    console.log()
    return '{}'
  }
}

export async function createServer(_server: ProtoServer, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
       const _id = new Types.ObjectId()
      const server = {
        ..._server, _id,
        password: _server.password ? _server.password :
          _server.useHTTP ? process.env.HTTP_CLIENT_PASS as string : process.env.CLIENT_PASS as string
      }
      const __server = await ServersManager.create(server) as any as Server
      const status = await checkServerStatus(server)
      addServerUpdate(
        _id, ADD_SERVER, 'Create Server',
        { stdout: `Added ${server.name}\n\nStatus: ${status}` },
        username, note
      )
      return Object.assign(__server, { status })
    } catch (err) {
      addSystemUpdate(
        ADD_SERVER, 'Create Server',
        { stderr: `SERVER CREATE ERROR:\n\n${JSON.stringify(err)}` },
        username, note, true
      )
      return 'error'
    }
  } else {
    addSystemUpdate(UNAUTHORIZED_ATTEMPT, 'Create Server', PERMISSIONS_DENY_LOG, username, note, true)
    return 'not permitted'
  }
}

export async function removeServer(serverID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const server = await ServersManager.findById(serverID) as any as Server
      await Promise.all(server.deploymentIDs.map(async id => {
        await deleteDeployment(id, username, permissions, note.length > 0 ? 'Re: Server Delete: ' + note : '')
      }))
      await ServersManager.deleteOne({ _id: serverID })
      await addSystemUpdate(
        REMOVE_SERVER, 'Remove Server',
        {
          stdout: 'Removed:\n\n' + Object.keys(server).map(field => {
            return `${field}: ${JSON.stringify(server[field])}\n`
          }).reduce((prev, curr) => prev + curr)
        },
        username, note
      )
      return 'removed'
    } catch (err) {
      addSystemUpdate(REMOVE_SERVER, 'Remove Server', { stdout: `REMOVE SERVER ERROR:\n\n${JSON.stringify(err)}` }, username, note, true)
      return 'error'
    }
  } else {
    addSystemUpdate(REMOVE_SERVER, 'Remove Server', PERMISSIONS_DENY_LOG, username, note, true)
    return 'error'
  }
}

export async function updateServer(server: Server, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const _id = new Types.ObjectId(server._id as any as string)
      const preServer = await ServersManager.findById(_id) as any as Server
      await ServersManager.updateOne({ _id }, server)
      addServerUpdate(
        _id, UPDATE_SERVER,
        'Server Update',
        { stdout: serverChangelog(preServer, server) },
        username, note
      )
      return server
    } catch (stderr) {
      addSystemUpdate(
        UPDATE_SERVER, 'Update Server (ERROR)', 
        { stderr: JSON.stringify(stderr) }, SYSTEM_OPERATOR, note, true
      )
    }
  } else {
    addSystemUpdate(
      UPDATE_SERVER, 'Update Server (DENIED)', 
      PERMISSIONS_DENY_LOG, SYSTEM_OPERATOR, note, true
    )
  }
}

export async function checkServerStatus({ name, address, port, password, useHTTP, enabled }: ProtoServer): Promise<'OK' | 'Incorrect Password' | 'Could Not Be Reached' | 'Disabled'> {
  if (!enabled) return 'Disabled'
  if (name !== SYSTEM_SERVER_NAME) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => { controller.abort() }, 
      SERVER_CHECK_TIMEOUT,
    )
    try {
      const res = await fetch(`http${useHTTP ? '' : 's'}://${address}:${port ? port : '6060'}/client/status`, {
        method: 'put',
        body: JSON.stringify({ password }),
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      return await res.json()
    } catch (err) {
      return 'Could Not Be Reached'
    } finally {
      clearTimeout(timeout)
    }
  } else {
    return 'OK'
  }
}

export async function pruneServer(serverID: string, username: string, permissions: number, note: string) {
  if (permissions >= 1) {
    try {
      const server = await ServersManager.findById(serverID) as any as Server
      const { log, success } = await execute(PRUNE_COMMAND, server)
      addServerUpdate(server._id, PRUNE_SERVER, PRUNE_COMMAND, log, username, note, !success)
    } catch (stderr) {
      addSystemUpdate(PRUNE_SERVER, PRUNE_COMMAND, { stderr: JSON.stringify(stderr) }, username, note, true)
    }
  } else {
    addSystemUpdate(PRUNE_SERVER, PRUNE_COMMAND, PERMISSIONS_DENY_LOG, username, note, true)
  }
}