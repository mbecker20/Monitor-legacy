import { exec } from 'child_process'
import fetch from 'node-fetch'
import { promisify } from 'util'
import { SYSTEM_SERVER_NAME } from '../const'

export const pExec = promisify(exec)



export async function execute(command: string, server: Server): Promise<{ log: Log, success: boolean }> {
  if (server.name === SYSTEM_SERVER_NAME) {
    return await executeLocal(command)
  } else {
    return await executeRemote(command, server)
  }
}

export async function executeLocal(command: string) {
  try {
    return {
      log: await pExec(command), success: true
    }
  } catch (err) {
    return {
      log: { stderr: JSON.stringify(err), stdout: '' },
      success: false
    }
  }
}

export async function executeRemote(command: string, { address, port, password, useHTTP }: Server) {
  // helper to execute commands on remote servers and return the log
  const res = await fetch(`http${useHTTP ? '' : 's'}://${address}:${port ? port : '6060'}/client`, {
    method: 'post',
    body: JSON.stringify({ command, password }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
  return await res.json()
}