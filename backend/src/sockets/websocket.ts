import WebSocket, { Server } from 'ws'
import http from 'http'
import { getFirstPathStar } from '../helpers/routing'
import { DEFAULT_INIT_SEND, ERROR } from '../const'
import { Application } from '../types/feathers'

export type Sockets = {
  [path: string]: Server
}

const AUTH = 'AUTH'
const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'

function websocketManager() {
  const sockets: Sockets = {}

  function addSocket(
    app: Application, path: string, 
    initSend?: () => Promise<any>, 
    onMessage?: (parsedMessage: any, ws: WebSocket) => Promise<void>,
    initType = AUTH
  ) {
    if (!sockets[path]) {
      sockets[path] = new Server({ noServer: true })
      sockets[path].on('connection', ws => {
        ws.on('message', async message => {
          const parsed = JSON.parse(message as string)
          const { accessToken } = parsed
          try {
            await app.service('authentication').verifyAccessToken(accessToken)
            ws.send(JSON.stringify(Object.assign({ type: initType }, initSend ? await initSend() : DEFAULT_INIT_SEND)))
            ws.removeEventListener('message')
            ws.on('message', async message => {
              const parsed = JSON.parse(message as string)
              try {
                if (onMessage) await onMessage(parsed, ws)
              } catch (err) {
                console.log('ERROR')
                console.log(err)
                console.log()
                ws.send(JSON.stringify({ type: ERROR, error: err }))
              }
            })
          } catch (err) {
            ws.send(JSON.stringify({ type: NOT_AUTHENTICATED }))
            ws.close()
          }
        })
      })
    } else {
      throw new Error('multiple sockets added on the same path')
    }
  }

  function addSocketWithTimeout(
    app: Application, path: string,
    initSend?: () => Promise<any>,
    onMessage?: (parsedMessage: any, ws: WebSocket) => Promise<void>,
    repeater?: (ws: Server) => void,
    timeout = 25000,
    initType = AUTH
  ) {
    addSocket(app, path, initSend, onMessage, initType)
    function repeat() {
      if (sockets[path]?.clients.size > 0 && repeater) repeater(sockets[path])
      setTimeout(repeat, timeout);
    }
    repeat()
  }

  function deleteSocket(path: string) {
    delete sockets[path]
  }

  function broadcast(path: string, type: string, message?: any) {
    if (sockets[path]) broadcastGivenWS(sockets[path], type, message)
  }

  function broadcastGivenWS(ws: Server, type: string, message?: any) {
    const toSend = JSON.stringify(Object.assign({ type }, message ? message : {}))
    ws.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(toSend)
      }
    })
  }

  function setup(server: http.Server) {
    setConnectionUpgrade(server, sockets)
  }

  return {
    addSocket, deleteSocket, setup, broadcast, addSocketWithTimeout, broadcastGivenWS
  }
}

function setConnectionUpgrade(httpServer: http.Server, sockets: Sockets) {
  httpServer.on('upgrade', (request, socket, head) => {
    for (const path of Object.keys(sockets)) {
      if (request.url === path || getFirstPathStar(request.url!) === path) {
        sockets[path].handleUpgrade(request, socket as any, head, ws => {
          sockets[path].emit('connection', ws, request)
        })
        break
      }
    }
  })
}

export function sendOverWS(ws: WebSocket, type: string, data?: any) {
  ws.send(JSON.stringify({ type, ...data }))
}

export function sendErrorOverWS(ws: WebSocket, message: string, error?: any, ) {
  sendOverWS(ws, ERROR, { error, message })
}

export default websocketManager