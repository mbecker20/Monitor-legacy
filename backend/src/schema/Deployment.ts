import { model, Schema } from 'mongoose'
import { ConversionSchema, EnvSchema, VolumeSchema } from './misc'

const DeploymentSchema = new Schema({
  name: { type: String, index: true },
  serverID: { type: String, index: true },
  buildID: { type: String, index: true },

  image: String,
  latest: Boolean, // if custom image, use this to add :latest
  ports: [ConversionSchema],
  volumes: [VolumeSchema],
  environment: [EnvSchema],
  useServerRoot: { type: Boolean, default: false },
  containerUser: String,
  logToAWS: { type: Boolean, default: true },
  network: String,
  restart: String,
  postImage: String,
  logTail: { type: Number, default: 500 },
  autoDeploy: { type: Boolean, default: false },
  containerName: String,
  folderName: String,
  envData: {}, // some object
  tags: [String],

  /* user who created */
  owner: { type: String, index: true },
}, { timestamps: true })

const DeploymentManager = model('Deployment', DeploymentSchema)

export default DeploymentManager