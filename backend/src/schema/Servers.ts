import { model, Schema } from 'mongoose'
import { SYSROOT } from '../const'
import { ScriptSchema } from './misc'

const ServersSchema = new Schema({
  name: { type: String, unique: true, index: true },
  address: { type: String, unique: true },
  password: String,
  port: { type: String, default: '6060' },
  status: String,
  useHTTP: { type: Boolean, default: false },
  websocketPort: { type: String, default: '7070' },
  rootDirectory: { type: String, default: SYSROOT },
  deploymentIDs: [String],
  scripts: [ScriptSchema],
  isAWS: {type: Boolean, default: false},
  operationIDs: [String],
  enabled: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true })

const ServersManager = model('Servers', ServersSchema)

export default ServersManager