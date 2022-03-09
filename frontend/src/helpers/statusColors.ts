import { AllContainerStatus, ContainerStatus } from "../state/types/container"
import { Deployment, Deployments } from "../state/types/deployment"
import { Server } from "../state/types/server"

export function getDeploymentStatusColor({ image, buildID, name }: Deployment, containerStatus?: ContainerStatus | 'not created') {
  return (image || buildID || name === 'Monitor' || name === 'Monitor Dev') ?
    containerStatus && containerStatus !== 'not created' ? containerStatus.State === 'running' ? 'var(--running)' : 'var(--stopped)' : 'var(--not-created)' :
    'var(--no-deploy)'
}

export function getDeploymentStatus(
  { image, buildID, name }: Deployment,
  containerStatus?: ContainerStatus | "not created"
) {
  return image || buildID || name === "Monitor" || name === "Monitor Dev"
    ? containerStatus && containerStatus !== "not created"
      ? containerStatus.State === "running"
        ? "Active"
        : "Inactive"
      : "Not Created"
    : "Not Deployed";
}

export function isDeploymentDown({ image }: Deployment, containerStatus?: ContainerStatus | 'not created') {
  return image ? (!containerStatus || (containerStatus && (containerStatus === 'not created' || containerStatus.State === 'running')) ? false : true) : false
}

export function getServerStatusColor(server: Server, deployments: Deployments, allContainerStatus: AllContainerStatus) {
  if (server.status === 'OK' || server.name === 'Monitor Server') {
    for (let i = 0; i < server.deploymentIDs.length; i++) {
      const deployment = deployments[server.deploymentIDs[i]]
      const status = allContainerStatus[deployment.containerName]
      if (isDeploymentDown(deployment, status)) {
        return 'var(--child-stopped)'
      }
    }
    return 'var(--running)'
  } else {
    return 'var(--stopped)'
  }
}

export function getServerStatus(
  server: Server,
  deployments: Deployments,
  allContainerStatus: AllContainerStatus
) {
  if (server.status === "OK" || server.name === "Monitor Server") {
    for (let i = 0; i < server.deploymentIDs.length; i++) {
      const deployment = deployments[server.deploymentIDs[i]];
      const status = allContainerStatus[deployment.containerName];
      if (isDeploymentDown(deployment, status)) {
        return "Child Stopped";
      }
    }
    return "Running";
  } else {
    return "Stopped";
  }
}