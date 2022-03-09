import { Application as ExpressFeathers } from '@feathersjs/express';
import { Types } from 'mongoose';
import { Container } from 'winston';

// A mapping of service names to types. Will be extended in service files.
interface ServiceTypes {}
// The application instance type that will be used everywhere else
type Application = ExpressFeathers<ServiceTypes>

/* service method params */
type AuthenticatedParams = {
  query: {
    userID: string
  }
}

type GHListenerCreateParams = {
  query: {
    pullName: string
  }
}

type CollectionFindParams = {
  query: {
    userID: string
  }
}