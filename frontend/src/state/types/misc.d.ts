export type Timestamp = {
  date: string
  time: string
}

export type Conversion = {
  _id?: string
  id?: string // used locally with component as key in map
  local: string
  container: string
}

export type Volume = {
  _id?: string
  id?: string
  local: string
  container: string
  useSystemRoot: boolean
}

// export type Script = {
//   name: string
//   script: string
// }

export type EnvironmentVar = {
  _id?: string
  id?: string
  variable: string
  value: string
}

export type Directories = {
  [dir: string]: Directories | false
}

export type SubType = 'server' | 'build' | 'deployment' | undefined

export type Log = {
  stdout?: string
  stderr?: string
}