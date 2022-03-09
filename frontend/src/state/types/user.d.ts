import { AuthenticatedParams } from "../../configureBackend/types"

type User = {
  _id: string
  username: string
  permissions: number
  githubId?: number
  avatar?: string
  authenticatedParams: AuthenticatedParams
  accessToken: string
}