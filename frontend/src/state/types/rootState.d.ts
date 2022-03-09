import { AllContainerStatus } from "./container";
import { Updates } from "./update";
import { Servers } from "./server";
import { User } from "./user";
import { Deployments } from "./deployment";
import { Builds } from "./build";
import { Log, SubType } from "./misc";
import { Collections } from "./collection";

export type RootState = {
  user: User
  deployments: Deployments
  builds: Builds
  servers: Servers
  allContainerStatus: AllContainerStatus
  refreshing: boolean
  updates: Updates
  collections: Collections
  subbed: {
    id: string // whatever items page is being viewed. 
    type: SubType // to route some actions
  }
  subbedUpdates: Updates // updates corresponding to subbed ID
  rootWS?: WebSocket
  // logWS?: {
  //   socket: WebSocket
  //   deploymentID: string
  // }
  containerLog: Log
  building: boolean
  deploying: boolean
  githubListenerURL: string
}