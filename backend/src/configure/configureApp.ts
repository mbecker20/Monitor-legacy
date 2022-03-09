import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import cors from 'cors'
import authentication from './authentication';
import configuration from '@feathersjs/configuration'
import helmet from 'helmet'
import compress from 'compression'
import mongoose from './mongoose'
import services from '../services'
import logger from './logger'
import serveFavicon from 'serve-favicon'
import path from 'path'
import { FRONTEND_REPO, REPO_PATH, ROOT } from '../const'
import { toPullName } from '../helpers/general'

function configureApp() {
  const app = express(feathers())

  // default configuration
  app.configure(configuration())
  // security
  app.use(helmet({
    contentSecurityPolicy: false
  }))
  /* Express middleware to parse HTTP JSON bodies */
  app.use(express.json())
  /* enable compression capabilities */
  app.use(compress())
  /* Express middleware to parse URL-encoded params */
  app.use(express.urlencoded({ extended: true }))

  /* Add REST API support */
  app.configure(express.rest())

  /* Configure mongoose connection */
  app.configure(mongoose)

  /* To securely process external requests */
  app.use(cors())

  /* add error handler */
  app.use(express.errorHandler())

  /* Add authentication */
  app.configure(authentication);

  /* Add services */
  app.configure(services)

  app.use(serveFavicon(REPO_PATH + `${toPullName(FRONTEND_REPO)}/deploy/favicon.ico`))
  /* Host the public folder */

  app.use(express.static(REPO_PATH + `${toPullName(FRONTEND_REPO)}/deploy`))
  app.get('*', (_, res) => res.sendFile(path.resolve(__dirname, REPO_PATH + `${toPullName(FRONTEND_REPO)}/deploy/index.html`)))

  // Configure a middleware for 404s and the error handler
  app.use(express.errorHandler({ logger } as any))
  app.use(express.notFound())

  return app
}

export default configureApp