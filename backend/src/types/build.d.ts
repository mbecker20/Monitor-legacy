import { Types } from "mongoose";

type ProtoBuild = {
  name: string
  /* repo related */
  repoURL?: string
  repoName?: string
  branch?: string

  /* build related */
  buildPath?: string
  dockerfilePath?: String // relative to buildPath
  owner: string
}

interface Build extends ProtoBuild {
  _id: Types.ObjectId
  pullName: string
  imageName: string
}

interface Builds {
  [index: string]: Build
}