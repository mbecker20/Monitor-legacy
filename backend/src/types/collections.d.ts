import { Types } from "mongoose";

interface Collection {
  _id: Types.ObjectId
  name: string
  deploymentIDs: string[]
  buildIDs: string[]
  userID: string
}