import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  username: { type: String, unique: true, index: true },
  password: String,
  githubId: Number,
  avatar: String, // url
  permissions: { type: Number, default: 0 },
}, { timestamps: true })

const UserManager = model('User', UserSchema)

export default UserManager