interface User {
  _id: Types.ObjectId
  username: string
  permissions: number
  githubId?: number
  avatar?: string
}