import { Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth'

import { Application } from '../types/feathers';

declare module '../types/feathers' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

const adminUsernames = ["mbecker20", "karamvirsingh98", "MoghTech"]
const usernames = [...adminUsernames]

class GitHubStrategy extends OAuthStrategy {
  async createEntity(profile: OAuthProfile, params: Params) {
    await new Promise((res, rej) => {
      if (usernames.includes(profile.login) || usernames.includes(profile.username)) {
        //console.log('github logged in')
        res(true)
      } else {
        //console.log('github rejected')
        rej(false)
      }
      
    })
    const data = await this.getEntityData(profile, null, params);

    return this.entityService.create(data, params);
  }

  async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
    const baseData = await super.getEntityData(profile, existing, params);

    return {
      ...baseData,
      // can also set the display name to profile.name
      username: profile.login,
      // The GitHub profile image
      avatar: profile.avatar_url,
      permissions: adminUsernames.includes(profile.login) ? 1 : 0
    };
  }
}

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('github', new GitHubStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth())
}
