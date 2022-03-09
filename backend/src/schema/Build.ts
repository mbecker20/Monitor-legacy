import { model, Schema } from 'mongoose'

const BuildSchema = new Schema({
  name: { type: String, unique: true, index: true },

  /* repo related */
  repoURL: String,
  repoName: String,
  pullName: { type: String, unique: true, index: true }, // the id used by github listener
  imageName: String,
  branch: String,
  remoteRepo: { type: Boolean, default: false },

  /* build related */
  buildPath: String,
  dockerfilePath: { type: String, default: 'Dockerfile' }, // relative to buildPath

  tags: [String],

  /* user who created */
  owner: { type: String, index: true },
}, { timestamps: true })

const BuildManager = model('Build', BuildSchema)

export default BuildManager