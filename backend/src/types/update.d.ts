import { Types } from "mongoose";

type Update = {
  _id: Types.ObjectId
  buildID?: Types.ObjectId
  deploymentID?: Types.ObjectId
  serverID?: Types.ObjectId
  operation: string
  timestamp: Timestamp
  command: string
  log: Log
  note: string
  isError?: boolean
  operator: string // the user
}