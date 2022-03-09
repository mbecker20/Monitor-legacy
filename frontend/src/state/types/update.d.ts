import { Log, Timestamp } from "./misc"

//export type Process = 'Stack' | 'Docker' | 'Repo' | 'Build' | 'Deploy'

export type Update = {
  _id: string
  buildID?: string
  deploymentID?: string
  serverID?: string
  //process: Process
  operation: string
  timestamp: Timestamp
  command: string
  log: Log
  isError?: boolean
  operator?: string // the user
  note: string
}

export interface Updates {
  [id: string]: Update
}