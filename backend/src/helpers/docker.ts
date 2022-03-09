import { dockerode } from "../main"
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DEPLOYDATA_ROOT, REGISTRY_URL, REGISTRY_URL_EXT, REPO_PATH, SERVER_CHECK_TIMEOUT, SYSROOT, SYSTEM_SERVER_NAME } from "../const"
import ServersManager from "../schema/Servers"
import { getDeployment, objFrom2Arrays, toContainerName } from "./general"
import { execute } from "./execute"
import { getDeploymentAndServer } from "./database"
import AbortController from "abort-controller"
import fetch from "node-fetch"
import { Build } from "../types/build"
import { Deployment } from "../types/deployment"
import BuildManager from "../schema/Build"

export function createDockerBuild({ name, buildPath, dockerfilePath, pullName }: Build) {
  return `cd ${REPO_PATH}${pullName}${buildPath ? buildPath[0] === '/' ? buildPath : '/' + buildPath : ''} && docker build -t ${REGISTRY_URL + toContainerName(name)} -f ${dockerfilePath} . && docker push ${REGISTRY_URL + toContainerName(name)}`
}

function portsString(ports?: Conversion[]) {
  return (ports && ports.length > 0) ? ports.map(({ local, container }) => ` -p ${local}:${container}`).reduce((prev, curr) => prev + curr) : ''
}

function volsString(folderName: string, volumes?: Volume[], server?: Server) {
  const rootDir = server ? (server.rootDirectory[server.rootDirectory.length - 1] === '/' ? server.rootDirectory : server.rootDirectory + '/') : SYSROOT
  return (volumes && volumes.length > 0) ? volumes.map(({ local, container, useSystemRoot }) => {
    const mid = useSystemRoot ? '' : `${DEPLOYDATA_ROOT}${folderName}/`
    const localString = local.length > 0 ? local[0] === '/' ? local.slice(1, local.length) : local : ''
    return ` -v ${rootDir + mid + localString}:${container}`
  }).reduce((prev, curr) => prev + curr) : ''
}

function restartString(restart?: string) {
  return restart ? ` --restart=${restart}${restart === 'on-failure' ? ':10' : ''}` : ''
}

function envString(environment?: EnvironmentVar[]) {
  return (environment && environment.length > 0) ? environment.map(({ variable, value }) => 
    ` -e "${variable}=${value}"`
  ).reduce((prev, curr) => prev + curr) : ''
}

function logString(containerName: string, logToAWS?: boolean) {
  if (logToAWS) {
    return ` -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" --log-driver=awslogs --log-opt awslogs-region=us-east-1 --log-opt awslogs-group=myLogGroup --log-opt awslogs-create-group=true --log-opt awslogs-stream=${containerName}`
  } else {
    return ''
  }
}

function networkString(network?: string) {
  return network ? ` --network=${network}` : ''
}

function containerUserString(containerUser?: string) {
  return containerUser && containerUser.length > 0 ? ` -u ${containerUser}` : ''
}

export async function createDockerRun({ 
  buildID, image, latest, ports, environment, network, 
  volumes, restart, postImage, containerName,
  containerUser, logToAWS, folderName
}: Deployment, server?: Server) {
  const isExternal = server && server.name !== SYSTEM_SERVER_NAME
  const registry = isExternal ? REGISTRY_URL_EXT : REGISTRY_URL
  const _image = buildID ? (registry + (await BuildManager.findById(buildID) as any as Build).imageName) : image
  return `docker pull ${_image}${(buildID || latest) ? ':latest' : ''} && ` +
    `docker run -d --name ${containerName}` + 
    containerUserString(containerUser) + portsString(ports) + volsString(folderName, volumes, server) + 
    envString(environment) + logString(containerName, logToAWS) + restartString(restart) + networkString(network) +
    ` ${_image}${(buildID || latest) ? ':latest' : ''}${postImage ? ' ' + postImage : ''}`
}

export async function getAllContainerStatus(deploymentsAr: Deployment[]) {
  const servers = await ServersManager.find({})
  return {
    ...await allContainerStatusLocal(deploymentsAr),
    ...Object.assign({},
      ...(await Promise.all(servers.filter((server: any) => server.name !== SYSTEM_SERVER_NAME).map(async (server: any) => await allContainerStatusRemote(deploymentsAr, server))))
    )
  }
}

export async function allContainerStatusLocal(deploymentsAr: Deployment[]) {
  const statusAr = await dockerode.listContainers({ all: true })
  const statusNames = statusAr.map(stat => stat.Names[0].slice(1, stat.Names[0].length)) // they all start with '/'
  const status = objFrom2Arrays(
    statusNames,
    statusAr.map((stat, i) => ({
      name: statusNames[i],
      Status: stat.Status,
      State: stat.State
    }))
  )
  return objFrom2Arrays(
    statusNames,
    await Promise.all(statusNames.map(async name => {
      const tryDeployment = getDeployment(status[name], deploymentsAr) as Deployment
      const _id = tryDeployment ? tryDeployment._id : 'none'
      return {
        ...status[name],
        deploymentID: _id,
      }
    }))
  )
}

export async function allContainerStatusRemote(deploymentsAr: Deployment[], server: Server) {
  try {
    const status = await fetchRemoteContainers(server)
    const statusNames = Object.keys(status)
    return objFrom2Arrays(
      statusNames,
      statusNames.map(name => {
        const tryDeployment = getDeployment(status[name], deploymentsAr) as Deployment
        const _id = tryDeployment ? tryDeployment._id : 'none'
        return {
          ...status[name],
          deploymentID: _id,
        }
      })
    )
  } catch (err) {
    return {}
  }
    
}

export async function getContainerStatus(deploymentID: string) {
  const { deployment, server } = await getDeploymentAndServer(deploymentID)
  const { _id, containerName } = deployment
  if (server.name === SYSTEM_SERVER_NAME) {
    const status = (await dockerode.listContainers({ all: true })).filter(({ Names }) => Names[0] === '/' + containerName)
    return status[0] ? {
      ...status[0],
      name: status[0].Names[0].slice(1, status[0].Names[0].length),
      deploymentID: _id,
    } : 'not created'
  } else {
    const status = await fetchRemoteContainer(containerName, server)
    return status === 'not created' ? status : {
      ...status,
      deploymentID: _id
    }
  }
}

export async function fetchRemoteContainers({ address, port, password, useHTTP, enabled }: Server) {
  if (!enabled) return {}
  const controller = new AbortController();
  const timeout = setTimeout(
    () => { controller.abort() },
    SERVER_CHECK_TIMEOUT,
  )
  try {
    const res = await fetch(`http${useHTTP ? '' : 's'}://${address}:${port ? port : '6060'}/client/allContainerStatus`, {
      method: 'put',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    })
    return await res.json()
  } catch (err) {
    return {}
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchRemoteContainer(name: string, { address, port, password, useHTTP }: Server) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => { controller.abort() },
    SERVER_CHECK_TIMEOUT,
  )
  try {
    const res = await fetch(`http${useHTTP ? '' : 's'}://${address}:${port ? port : '6060'}/client/${toContainerName(name)}`, {
      method: 'patch',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await res.json()
  } catch (err) {
    return 'not created'
  } finally {
    clearTimeout(timeout)
  }
}

export async function getContainerLog(deploymentID: string, logTail?: number) {
  const { deployment, server } = await getDeploymentAndServer(deploymentID)
  if (!server.enabled) return { stdout: '' }
  const _logTail = logTail ? logTail : deployment.logTail
  return (await execute(`docker logs ${deployment.containerName}${_logTail ? ` --tail ${_logTail}` : ''}`, server)).log
}