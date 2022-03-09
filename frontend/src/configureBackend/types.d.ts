import { AllContainerStatus } from "../state/types/container"
import { Updates } from "../state/types/update"
import { Servers } from "../state/types/server"
import { Deployments } from "../state/types/deployment"
import { Builds } from "../state/types/build"
import { Collection } from "../state/types/collection"

/* service method params */
export type AuthenticatedParams = {
  query: { userID: string }
  headers: { Authorization: string }
}

export type GHListenerCreateParams = {
  query: {
    name: string
  }
}

export type ServersManager = {
  find: (params: AuthenticatedParams) => Promise<Servers | 'error'>
  // create: (server: ProtoServer, params: AuthenticatedParams) => Promise<{ server: Server, status: ServerStatus } | 'error'>
  // update: (serverID: string, server: Partial<Server>, params: AuthenticatedParams) => Promise<'OK' | 'Incorrect Password' | 'Could Not Be Reached' | 'error'>
  // remove: (serverID: string, params: AuthenticatedParams) => Promise<'removed' | 'error'>
}

// type StackPatchReturn = AllContainerStatus | ContainerStatus | string | 'not created' | 'unknown Update' | 'error'

export type BuildManager = {
  find: (params: AuthenticatedParams) => Promise<Builds | 'error'>
  // create: (stack: ProtoStack, params: AuthenticatedParams) => Promise<Stack | 'error'>
  // get: (id: string, params: StackGetParams) => Promise<string | string[] | 'unknown Update' | 'error'>
  // update: (id: string, stack: Partial<Stack>, params: AuthenticatedParams) => Promise<'updated' | 'error'>
  // patch: (id: string, data: StackPatchData, params: AuthenticatedParams) => Promise<StackPatchReturn>
  // remove: (stackID: string, params: AuthenticatedParams) => Promise<'deleted' | 'error'>
}

export type DeploymentManager = {
  find: (params: AuthenticatedParams) => Promise<{ deployments: Deployments, allContainerStatus: AllContainerStatus } | 'error'>
  // create: (stack: ProtoStack, params: AuthenticatedParams) => Promise<Stack | 'error'>
  // get: (id: string, params: StackGetParams) => Promise<string | string[] | 'unknown Update' | 'error'>
  // update: (id: string, stack: Partial<Stack>, params: AuthenticatedParams) => Promise<'updated' | 'error'>
  // patch: (id: string, data: StackPatchData, params: AuthenticatedParams) => Promise<StackPatchReturn>
  // remove: (stackID: string, params: AuthenticatedParams) => Promise<'deleted' | 'error'>
}

export type UpdateManager = {
  find: (params: AuthenticatedParams) => Promise<Updates | 'error'>
}

export type CollectionManager = {
  find: (params: AuthenticatedParams) => Promise<Collection | 'error'>
}