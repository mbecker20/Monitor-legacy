import { createMidReducer, createSingleReducerBundle } from "kbin-state";
import { DELETE_CONTAINER, DEPLOY, REDEPLOY, START_CONTAINER, STOP_CONTAINER } from "./deployments";
import { AllContainerStatus } from "./types/container";
import { Log } from "./types/misc";
import { RootState } from "./types/rootState";
import { STOP_REFRESHING, SWITCH_SUB } from "./updates";

export const REFRESH_CONTAINER_STATUS = 'REFRESH_CONTAINER_STATUS'
export const REFRESH_ALL_CONTAINER_STATUS = 'REFRESH_ALL_CONTAINER_STATUS'
export const GET_CONTAINER_LOG = 'GET_CONTAINER_LOG'
export const APPEND_TO_LOG = 'APPEND_TO_LOG'

export const containerStatusReducer = createMidReducer<RootState, AllContainerStatus>('allContainerStatus', {
  ...createSingleReducerBundle([
    REFRESH_ALL_CONTAINER_STATUS,
    STOP_REFRESHING,
  ], (_, { allContainerStatus }) => allContainerStatus),
  ...createSingleReducerBundle([
    DEPLOY,
    REDEPLOY,
    START_CONTAINER,
    STOP_CONTAINER,
    DELETE_CONTAINER,
    REFRESH_CONTAINER_STATUS
  ], ({ allContainerStatus, deployments }, { containerStatus, deploymentID }) => {
    if (deployments[deploymentID]) {
      return {
        ...allContainerStatus,
        [deployments[deploymentID].containerName]: containerStatus
      }
    } else {
      return allContainerStatus
    }
  })
})

export const containerLogReducer = createMidReducer<RootState, Log>('containerLog', {
  [GET_CONTAINER_LOG]: (state, { containerLog }) => {
    if (containerLog) {
      return containerLog
    } else {
      return state.containerLog
    }
  },
  ...createSingleReducerBundle([
    DEPLOY,
    REDEPLOY,
    DELETE_CONTAINER,
    START_CONTAINER
  ], (state, { containerLog, deploymentID }) => {
    if (containerLog && state.subbed.id === deploymentID) {
      return containerLog
    } else {
      return state.containerLog
    }
  }),
  [APPEND_TO_LOG]: ({ containerLog }, { newLines }) => {
    if (containerLog.stdout === 'Started') {
      return { ...containerLog, stdout: newLines }
    } else if (newLines) {
      return { ...containerLog, stdout: (containerLog.stdout && containerLog.stdout.length > 0) ? containerLog.stdout + '\n' + newLines : newLines }
    } else {
      return containerLog
    }
  },
  [SWITCH_SUB]: () => ({})
})