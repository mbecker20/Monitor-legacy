export type ProtoBuild = {
  name: string
  repoURL?: string
  repoName?: string
  branch?: string
  buildPath?: string
  dockerfilePath?: string // relative to build path
  owner: string
}

export interface Build extends ProtoBuild {
  _id: string
  pullName: string
  imageName: string
}

export interface Builds {
  [index: string]: Build
}