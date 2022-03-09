import { ServiceMethods, Params, Id, NullableId } from "@feathersjs/feathers"
import { REPO_PATH, SYSTEM_OPERATOR } from "../const"
import { executeLocal } from "../helpers/execute"
import { createDockerBuild } from "../helpers/docker"
import BuildManager from "../schema/Build"
import { addBuildUpdate, addSystemUpdate } from "../helpers/updates"
import { GHListenerCreateParams } from "../types/feathers"
import { Build } from "../types/build"

const LISTENER_ERROR = 'Listener Error'
const AUTO_PULL = 'Auto Pull'
const AUTO_BUILD = 'Auto Build'

class GithubListenerService implements ServiceMethods<any> {
  async find(params: Params) {
    return []
  }
  
  async get(id: Id, params: Params) { 

  }
  
  async create(_: any, { query }: GHListenerCreateParams) { 
    const { pullName } = query
    try {
      const build = await BuildManager.findOne({ pullName }) as any as Build
      if (build && build._id) {
        const { _id, buildPath, dockerfilePath, branch } = build
        const pullCommand = `cd ${REPO_PATH}${pullName} && git pull origin ${branch ? branch : "master"}`
        const { log: pullLog, success: pullSuccess } = await executeLocal(pullCommand)
        if (buildPath && dockerfilePath) {
          const buildCommand = createDockerBuild(build)
          const { log: buildLog, success: buildSuccess } = await executeLocal(buildCommand)
          await addBuildUpdate(
            _id, AUTO_BUILD,
            `Pull: ${pullCommand}\n\nBuild: ${buildCommand}`,
            { 
              stdout: pullLog.stdout + '\n\n' + buildLog.stdout,
              stderr: pullLog.stderr + '\n\n' + buildLog.stderr,
            },
            SYSTEM_OPERATOR,
            '',
            !(pullSuccess && buildSuccess)
          )
        } else {
          // no docker build associated
          await addBuildUpdate(
            _id, AUTO_PULL,
            `Pull: ${pullCommand}`, pullLog,
            SYSTEM_OPERATOR,
            "",
            !pullSuccess
          )
        }
        return 'success'
      } else {
        await addSystemUpdate(
          AUTO_PULL, 'Auto Pull', { stderr: 'Auto pull failed - name not recognized' }, SYSTEM_OPERATOR, '', true
        )
        return 'error'
      }
    } catch (err) {
      try {
        await addSystemUpdate(
          LISTENER_ERROR, 'Auto Pull', { stderr: JSON.stringify(err) }, SYSTEM_OPERATOR, '', true
        )
      } catch (err) {
        console.log('ERROR')
        console.log(err)
        console.log()
        // if can't add update might as well just try to log the error here
      }
      return 'error'
    }
  }
  
  async update(id: NullableId, data: any, params: Params) { 

  }
  
  async patch(id: NullableId, data: any, params: Params) { 

  }
  
  async remove(id: NullableId, params: Params) { 
    
  }
}

export default GithubListenerService