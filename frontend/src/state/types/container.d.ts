type ContainerStatus = {
  name: string
  stackID?: string
  Status: string
  State: 'running' | 'exited'
}

export interface AllContainerStatus {
  [index: string]: ContainerStatus | 'not created'
}