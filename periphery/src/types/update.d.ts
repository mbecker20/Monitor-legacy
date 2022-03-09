type Update = {
  _id: string
  buildID?: string
  deploymentID?: string
  serverID?: string
  operation: string
  timestamp: Timestamp
  command: string
  log: Log
  note: string
  isError?: boolean
  operator: string // the user
}