import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
import { AuthenticatedParams, ServersManager, BuildManager, DeploymentManager, UpdateManager, CollectionManager } from './types'
import { User } from '../state/types/user'
import { reInitialize, resetState, select } from '../index'

const HOST_ADDRESS = 'https://monitor.mogh.tech'
export const WS_URL = 'wss://monitor.mogh.tech'
// export const LOG_WS_URL = 'wss://api.ethdevtech.com/monitorlogs?name='

function configureBackend() {
  const client = feathers()
  const restClient = rest(HOST_ADDRESS)
  client.configure(restClient.fetch(window.fetch))
  // use local storage to store to login token
  client.configure(authentication({
    storage: window.localStorage
  }))
  async function jwtLogin() {
    const { user, accessToken } = await client.reAuthenticate()
    return {
      user: { ...user, accessToken } as User,
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  }
  async function localLogin(username: string, password: string) {
    await client.authenticate({
      strategy: 'local',
      username, password,
    })
  }
  async function createLocalUser(username: string, password: string, permissions: number) {
    await client.service('users').create({
      username, password, permissions
    })
  }
  async function githubLogin() {
    window.location.replace(`${HOST_ADDRESS}/oauth/github`)
  }
  async function logout() {
    await client.logout()
    resetState()
  }
  async function getUser(): Promise<User> {
    const { user, headers } = await jwtLogin()
    const authenticatedParams = { query: { userID: user._id as string }, headers }
    const fullUser = await client.service('users')
      .find({ query: { _id: user._id }, headers }).then((doc: any) => doc.data[0])
    return {
      _id: user._id,
      username: user.username,
      permissions: fullUser.permissions,
      githubId: fullUser.githubId,
      avatar: fullUser.avatar,
      authenticatedParams,
      accessToken: user.accessToken,
    }
  }
  async function getAuthenticatedHeader() {
    const { accessToken } = await client.reAuthenticate()
    return {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  }
  async function changeUsernamePassword(username: string, password: string, authenticatedParams: AuthenticatedParams) {
    const { data } = await client.service('users').find({ query: { username: select(state => state.user.username) }, headers: authenticatedParams.headers })
    await client.service('users').update(data[0]._id, { 
      username, password, permissions: data[0].permissions, githubId: data[0].githubId, avatar: data[0].avatar
    }, { headers: authenticatedParams.headers })
    await client.logout()
    await localLogin(username, password)
    await reInitialize(true)
  }
   // return all the services
  return {
    buildManager: client.service('/_builds') as BuildManager,
    deploymentManager: client.service('/_deployments') as DeploymentManager,
    serverManager: client.service('/_servers') as ServersManager,
    updateManager: client.service('/_updates') as UpdateManager,
    collectionManager: client.service('/_collections') as CollectionManager,
    jwtLogin, createLocalUser, localLogin, githubLogin, logout,
    getUser, getAuthenticatedHeader, changeUsernamePassword
  }
}

export default configureBackend