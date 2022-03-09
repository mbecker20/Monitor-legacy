type ProtoServer = {
  name: string
  address: string
  password: string
  port: string
  rootDirectory: string
  deploymentIDs: string[]
  status: 'OK' | 'Incorrect Password' | 'Could Not Be Reached'
  isAWS?: boolean
  useHTTP?: boolean
  enabled: boolean
}

interface Server extends ProtoServer {
  _id: Types.ObjectId
}