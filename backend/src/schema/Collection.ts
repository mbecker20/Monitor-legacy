import { model, Schema } from 'mongoose'

const CollectionSchema = new Schema({
  name: String,
  deploymentIDs: [String],
  buildIDs: [String],
  userID: { type: String, index: true }
}, { timestamps: true })

const CollectionManager = model('Collection', CollectionSchema)

export default CollectionManager