type ContainerStatus = {
  name: string
  deploymentID?: string
  Status: string
  State: 'running' | 'exited'
}

type FullContainerStatus = {
  Id: string
  name: string
  deploymentID?: string
  Names: string[]
  Image: string
  ImageID: string
  Command: string
  Created: number
  Ports: { IP: string, PrivatePort: number, PublicPort: number, Type: string }[]
  Labels: { [index: string]: string }
  State: 'running' | 'exited'
  Status: string
  HostConfig: { NetworkMode: string }
  NetworkSettings: {
    Networks: {
      [index: string]: {
        IPAMConfig: any,
        Links: any,
        Aliases: any,
        NetworkID: string,
        EndpointID: string,
        Gateway: string,
        IPAddress: string,
        IPPrefixLen: number,
        IPv6Gateway: string,
        GlobalIPv6Address: string,
        GlobalIPv6PrefixLen: number,
        MacAddress: string,
        DriverOpts: any
      }
    }
  }
  Mounts: {
    Type: 'volume' | 'bind',
    Name?: string,
    Source: string,
    Destination: string,
    Driver?: string,
    Mode: string,
    RW: boolean,
    Propagation: string
  }[]
}