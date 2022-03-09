import BuildManager from "../schema/Build"
import DeploymentManager from "../schema/Deployment"
import { Build } from "../types/build"
import { Deployment } from "../types/deployment"

export const PULLING = 'pulling'
export const BUILDING = 'building'
export const DEPLOYING = 'deploying'
export const STARTING = 'starting'
export const STOPPING = 'stopping'
export const DELETING = 'deleting'

/* 
when there are potentially more than one user viewing the same deployment / build,
they may send in actions at the same time. this manages to make sure
we don't process two users performing same action simultaneously
*/

function makeActionStateManager() {
  const buildActionStates: BuildActionStates = {}
  const deployActionStates: DeployActionStates = {}

  async function setupActionStateManager() {
    (await BuildManager.find({}) as any as Build[])
      .forEach(({ _id }) => addBuildActionState(_id.toHexString()));

    (await DeploymentManager.find({}) as any as Deployment[])
      .forEach(({ _id }) => addDeployActionState(_id.toHexString()));
  }

  function addBuildActionState(buildID: string) {
    buildActionStates[buildID] = {
      pulling: false,
      building: false
    }
  }

  function addDeployActionState(deploymentID: string) {
    deployActionStates[deploymentID] = {
      deploying: false,
      deleting: false,
      starting: false,
      stopping: false
    }
  }

  function deleteBuildActionState(buildID: string) {
    delete buildActionStates[buildID]
  }

  function getBuildActionState(buildID: string, type: string) {
    return buildActionStates[buildID][type]
  }

  function setBuildActionState(buildID: string, type: string, state: boolean) {
    buildActionStates[buildID][type] = state
  }

  function getMultiBuildActionState(buildID: string, types: string[]) {
    for (const type of types) {
      if (getBuildActionState(buildID, type)) return true
    }
  }

  function deleteDeployActionState(deploymentID: string) {
    delete deployActionStates[deploymentID]
  }

  function getDeployActionState(deploymentID: string, type: string) {
    return deployActionStates[deploymentID][type]
  }

  function setDeployActionState(deploymentID: string, type: string, state: boolean) {
    deployActionStates[deploymentID][type] = state
  }

  function getMultiDeployActionState(deploymentID: string, types: string[]) {
    for (const type of types) {
      if (getDeployActionState(deploymentID, type)) return true
    }
  }

  return {
    addBuildActionState,
    deleteBuildActionState,
    getBuildActionState,
    getMultiBuildActionState,
    setBuildActionState,
    addDeployActionState,
    deleteDeployActionState,
    getDeployActionState,
    getMultiDeployActionState,
    setDeployActionState,
    setupActionStateManager
  }
}

export default makeActionStateManager