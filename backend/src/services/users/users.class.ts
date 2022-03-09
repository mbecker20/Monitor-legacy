import { Service, MongooseServiceOptions } from 'feathers-mongoose'
import { Application } from '../../types/feathers'

export class Users extends Service {
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options)
  }
}
