export type ProtoCollection = {
  name: string
  deploymentIDs: string[]
  userID: string
}

export interface Collection extends ProtoCollection {
  _id: string;
  expanded: boolean;
}

export interface Collections {
  [index: string]: Collection
}