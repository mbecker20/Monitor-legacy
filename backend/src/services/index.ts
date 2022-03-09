import { ServiceMethods, Params, Id, NullableId } from "@feathersjs/feathers"
import users from './users/users.service'
import * as authentication from '@feathersjs/authentication'
import GithubListenerService from './githubListener'
import { findServers } from "./servers"
import { findDeploymentsStatus } from "./deployments"
import { findFullWithFilter, findFullWithLimit } from "../helpers/database"
import UpdateManager from "../schema/Update"
import { findBuilds } from "./builds"
import CollectionManager from "../schema/Collection"
import { Application } from "@feathersjs/express"
import { CollectionFindParams } from "../types/feathers"

const { authenticate } = authentication.hooks
const requireAuthentication = {
  before: {
    all: [authenticate('jwt')]
  }
}

function addAuthenticatedService(path: string, service: ServiceMethods<any>) {
  return (app: Application) =>  {
    app.use(path, service)
    const serv = app.service(path) as any
    serv.hooks(requireAuthentication)
  }
}

export default function (app: Application): void {
  /* configure users service */
  app.configure(users)
  /* Add services to app */
  app.configure(addAuthenticatedService('/_builds', new BuildService()))
  app.configure(addAuthenticatedService('/_deployments', new DeploymentService()))
  app.configure(addAuthenticatedService('/_servers', new ServerService()))
  app.configure(addAuthenticatedService('/_updates', new UpdatesService()))
  app.configure(addAuthenticatedService('/_collections', new CollectionsService()))

  app.use('githubListener', new GithubListenerService())
}

class ServerService implements ServiceMethods<any> {
  async find(params: Params) {
    return await findServers()
  }

  async get(id: Id, params: Params) {

  }

  async create(data: any, params: Params) {

  }

  async update(id: NullableId, data: any, params: Params) {

  }

  async patch(id: NullableId, data: any, params: Params) {

  }

  async remove(id: NullableId, params: Params) {

  }
}

class BuildService implements ServiceMethods<any> {
  async find(params: Params) {
    return await findBuilds()
  }

  async get(id: Id, params: Params) {

  }

  async create(data: any, params: Params) {

  }

  async update(id: NullableId, data: any, params: Params) {

  }

  async patch(id: NullableId, data: any, params: Params) {

  }

  async remove(id: NullableId, params: Params) {

  }
}

class DeploymentService implements ServiceMethods<any> {
  async find(params: Params) {
    return await findDeploymentsStatus()
  }

  async get(id: Id, params: Params) {

  }

  async create(data: any, params: Params) {

  }

  async update(id: NullableId, data: any, params: Params) {

  }

  async patch(id: NullableId, data: any, params: Params) {

  }

  async remove(id: NullableId, params: Params) {

  }
}

class UpdatesService implements ServiceMethods<any> {
  async find(params: Params) {
    return await findFullWithLimit(UpdateManager, 10)
  }
  
  async get(id: Id, params: Params) { 

  }
  
  async create(data: any, params: Params) { 

  }
  
  async update(id: NullableId, data: any, params: Params) { 

  }
  
  async patch(id: NullableId, data: any, params: Params) { 

  }
  
  async remove(id: NullableId, params: Params) { 

  }
}

class CollectionsService implements ServiceMethods<any> {
  async find(params: CollectionFindParams) {
    const { query } = params
    return await findFullWithFilter(CollectionManager, { userID: query.userID })
  }
  
  async get(id: Id, params: Params) { 

  }
  
  async create(data: any, params: Params) { 

  }
  
  async update(id: NullableId, data: any, params: Params) { 

  }
  
  async patch(id: NullableId, data: any, params: Params) { 

  }
  
  async remove(id: NullableId, params: Params) { 

  }
}


