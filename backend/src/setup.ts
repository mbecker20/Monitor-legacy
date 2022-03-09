import { REPO_PATH, SYSTEM_NAME, FRONTEND_REPO, SYSTEM_SERVER_NAME, SYSROOT, SYSTEM_OPERATOR, IS_DEV, MONGO_URL, GH_ACCESS_TOKEN } from "./const"
import { Types } from 'mongoose'
import mongoose from 'mongoose'
import ServersManager from "./schema/Servers"
import { getRepositoryName, toContainerName, toFolderName, toImageName, toPullName } from "./helpers/general"
import { executeLocal } from "./helpers/execute"
import { createDockerRun } from "./helpers/docker"
import BuildManager from "./schema/Build"
import DeploymentManager from "./schema/Deployment"
import { addBuildUpdate, addDeploymentUpdate } from "./helpers/updates"
import { CREATE_DEPLOYMENT } from './services/deployments'
// import { CLONE, RUN_BUILD } from "./services/builds"
import { Deployment, ProtoDeployment } from "./types/deployment"
import { Build, ProtoBuild } from "./types/build"

// const SERVER_CLIENT_BUILD = 'Server Client'
const MONGO_NAME = 'MongoDB'
const IMAGE_REGISTRY = 'Image Registry'

export default async function setup() {
  console.log('Monitor does not appear to be initialized. Setting up...\n')

  const localhost: ProtoServer = {
    name: SYSTEM_SERVER_NAME,
    rootDirectory: SYSROOT,
    address: 'localhost',
    password: '',
    port: '',
    status: 'OK',
    deploymentIDs: [],
    enabled: true
  }

  const mongoDeployment: ProtoDeployment | Deployment = {
    name: MONGO_NAME,
    serverID: 'unset',
    image: 'mongo',
    latest: true,
    ports: [{ local: '27017', container: '27017' }],
    volumes: [{ local: 'dbdata', container: '/data/db' }],
    restart: 'unless-stopped',
    owner: SYSTEM_OPERATOR,
    logToAWS: false,
    folderName: toFolderName(MONGO_NAME),
    containerName: toContainerName(MONGO_NAME)
  }

  const registryDeployment: ProtoDeployment | Deployment = {
    name: IMAGE_REGISTRY,
    serverID: 'unset',
    image: 'registry:2',
    latest: false,
    ports: [{ local: '5000', container: '5000' }],
    volumes: [{ local: '', container: '/var/lib/registry' }],
    restart: 'unless-stopped',
    owner: SYSTEM_OPERATOR,
    logToAWS: false,
    folderName: toFolderName(IMAGE_REGISTRY),
    containerName: toContainerName(IMAGE_REGISTRY)
  }

  const repoURL = "MoghTech/monitor-frontend-deployment"

  const monitorPublic: ProtoBuild | Build = {
    name: FRONTEND_REPO,
    repoName: getRepositoryName(repoURL),
    repoURL,
    branch: 'master',
    pullName: toPullName(FRONTEND_REPO),
    imageName: toImageName(FRONTEND_REPO),
    owner: SYSTEM_OPERATOR
  }

  const monitorDeployment: ProtoDeployment | Deployment = {
    name: SYSTEM_NAME,
    serverID: 'unset',
    owner: SYSTEM_OPERATOR,
    logToAWS: false,
    folderName: toFolderName(SYSTEM_NAME),
    containerName: toContainerName(SYSTEM_NAME)
  }

  // const serverClient: ProtoBuild | Build = {
  //   name: SERVER_CLIENT_BUILD,
  //   repoURL: 'https://github.com/MoghTech/monitor-server-client.git',
  //   branch: 'master',
  //   buildPath: '/deploy',
  //   dockerfilePath: 'Dockerfile',
  //   pullName: toPullName(SERVER_CLIENT_BUILD),
  //   imageName: toImageName(SERVER_CLIENT_BUILD),
  //   owner: SYSTEM_OPERATOR,
  // }

  let mongoCommand = ''
  let mongoLog = { stdout: '', stderr: '' }

  if (!IS_DEV) {
    // only create new mongo if not dev
    console.log('creating mongo')
    mongoCommand = await createDockerRun(mongoDeployment as Deployment)
    mongoLog = (await executeLocal(mongoCommand)).log
    console.log('mongo created: \n')
    console.log('containerID: ' + mongoLog.stdout + mongoLog.stderr)
    console.log()

    setTimeout(() => {
      console.log('connecting in 3s')
    }, 2000);
    setTimeout(() => {
      console.log('connecting in 2s')
    }, 3000);
    setTimeout(() => {
      console.log('connecting in 1s')
    }, 4000);
  } else {
    mongoCommand = 'Create MongoDB'
    mongoLog = { stdout: 'Mongo Created', stderr: '' }
  }

  await new Promise((resolve, reject) => setTimeout(async () => {
    console.log('connecting to db')
    try {
      mongoose.connect(MONGO_URL)
      resolve('')
    } catch (err) {
      console.log('ERROR')
      reject(err)
    }
  }, 5000));

  console.log()
  console.log('connected to mongo')
  console.log()
  console.log('creating database entries')

  const serverID = new Types.ObjectId()
  const regID = new Types.ObjectId()
  const publicID = new Types.ObjectId()
  const mongoID = new Types.ObjectId()
  const monitorID = new Types.ObjectId()
  // const serverClientID = Types.ObjectId()

  await ServersManager.create({ ...localhost, _id: serverID, deploymentIDs: [regID, mongoID, monitorID] })
  await BuildManager.create({ ...monitorPublic, _id: publicID })
  // await BuildManager.create({ ...serverClient, _id: serverClientID })
  await DeploymentManager.create({ ...registryDeployment, _id: regID, serverID })
  await DeploymentManager.create({ ...mongoDeployment, _id: mongoID, serverID })
  await DeploymentManager.create({ ...monitorDeployment, _id: monitorID, serverID })

  await addDeploymentUpdate(mongoID, CREATE_DEPLOYMENT, 'Create MongoDB', { stdout: 'Mongo Created' }, SYSTEM_OPERATOR)

  await addDeploymentUpdate(monitorID, CREATE_DEPLOYMENT, 'Create Deployment', { stdout: 'Deployment Created' }, SYSTEM_OPERATOR)

  if (!IS_DEV) {
    console.log('creating registry')
    const regCommand = await createDockerRun(registryDeployment as Deployment)
    const regDeployLog = await executeLocal(regCommand)
    await addDeploymentUpdate(regID, CREATE_DEPLOYMENT, regCommand, regDeployLog.log, SYSTEM_OPERATOR, '', !regDeployLog.success)
    console.log('registry created')
    console.log('containerID: ' + regDeployLog.log.stdout + regDeployLog.log.stderr)
    console.log()
  }
  

  console.log('cloning frontend')
  const cloneCommand = `git clone https://${process.env.GH_ACCESS_TOKEN}@github.com/${monitorPublic.repoURL}.git ${REPO_PATH}${toPullName(FRONTEND_REPO)}`
  const publicLog = await executeLocal(cloneCommand)
  console.log(publicLog)
  await addBuildUpdate(publicID, 'Clone Frontend', cloneCommand, publicLog.log, SYSTEM_OPERATOR, '', !publicLog.success)
  console.log('database entries created')

  console.log()

  // console.log('creating server client build')
  // console.log()
  // console.log('cloning...')
  // const scCloneCommand = `git clone ${serverClient.repoURL} ${REPO_PATH}${(serverClient as Build).pullName}`
  // const scCloneLog = await executeLocal(scCloneCommand)
  // await addBuildUpdate(
  //   serverClientID, CLONE, scCloneCommand,
  //   scCloneLog.log, SYSTEM_OPERATOR, '', !scCloneLog.success
  // )
  // console.log('building...')
  // const scBuildCommand = createDockerBuild(serverClient as Build)
  // const scBuildLog = await executeLocal(scBuildCommand)
  // await addBuildUpdate(
  //   serverClientID, RUN_BUILD, scBuildCommand,
  //   scBuildLog.log, SYSTEM_OPERATOR, '', !scBuildLog.success
  // )

  // console.log('server client build complete')

  console.log()
  console.log('starting monitor')
  console.log()
}