export type ProtoServer = {
  name: string
  address: string
  port: string
  deploymentIDs: string[]
  isAWS?: boolean
  useHTTP?: boolean
  enabled: boolean
}

export type ServerStatus = 'OK' | 'Could Not Be Reached' | 'Incorrect Password'

export interface Server extends ProtoServer {
  status: ServerStatus
  _id: string
  expanded: boolean
  password: string
  rootDirectory: string
  status: 'OK' | 'Incorrect Password' | 'Could Not Be Reached'
}

export interface Servers {
  [id: string]: Server
}