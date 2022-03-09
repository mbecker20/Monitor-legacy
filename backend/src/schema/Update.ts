import { model, Schema } from 'mongoose'
import { LogSchema, TimestampSchema } from './misc'

const UpdateSchema = new Schema({
  operator: { type: String, index: true },
  deploymentID: { type: String, index: true },
  buildID: { type: String, index: true },
  serverID: { type: String, index: true }, 
  operation: { type: String, index: true },
  command: String,
  log: LogSchema,
  note: String, // for the operator to leave notes on what they are doing
  isError: Boolean,
  timestamp: TimestampSchema
}, { timestamps: true })
const UpdateManager = model('Update', UpdateSchema)

export default UpdateManager