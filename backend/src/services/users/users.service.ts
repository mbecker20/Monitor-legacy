import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../types/feathers';
import { Users } from './users.class';
import hooks from './users.hooks';
import UserManager from '../../schema/User';
// import { ADMIN_PASS } from '../../const';

// Add this service to the service type index
declare module '../../types/feathers' {
  interface ServiceTypes {
    'users': Users & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: UserManager,
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/users', new Users(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users');
  service.hooks(hooks);
  // UserManager.find({}).then(async users => {
  //   if (users.length === 0) {
  //     // await service.create({
  //     //   username: 'admin',
  //     //   password: ADMIN_PASS,
  //     //   permissions: 2
  //     // })
  //     // await service.create({
  //     //   username: 'EthDev',
  //     //   password: 'ethdev123',
  //     //   permissions: 0
  //     // })
  //   }
  // })
  
}
