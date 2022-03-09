type Log = {
  stdout?: string
  stderr?: string
}

type Timestamp = {
  date: string
  time: string
}

type Script = {
  name: string
  script: string
}

type Conversion = {
  local: string
  container: string
}

interface Volume extends Conversion {
  useSystemRoot?: boolean
}

type EnvironmentVar = {
  variable: string
  value: string
}

type BuildActionState = {
  pulling: boolean
  building: boolean
}

type DeployActionState = {
  deploying: boolean
  deleting: boolean
  starting: boolean
  stopping: boolean
}

interface BuildActionStates {
  [buildID: string]: BuildActionState
}

interface DeployActionStates {
  [deploymentID: string]: DeployActionState
}