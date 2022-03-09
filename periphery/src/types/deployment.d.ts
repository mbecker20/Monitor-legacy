type ProtoDeployment = {
  name: string;
  serverID: string;

  buildID?: string; // if deploying a monitor build. can build / get build updates from the deployment page.
  image?: string; // this is set on creation using the attached buildID, or is passed directly
  latest?: boolean; // if custom image, use this to add :latest
  ports?: Conversion[];
  volumes?: Volume[];
  environment?: EnvironmentVar[];
  network?: string;
  restart?: string;
  postImage?: string;
  logTail?: number;
  containerUser?: string;
  // logToAWS?: boolean
  useServerRoot?: boolean;
  autoDeploy?: boolean;
  owner: string;
};

interface Deployment extends ProtoDeployment {
  _id: string;
  folderName: string;
  containerName: string;
}

interface Deployments {
  [index: string]: Deployment;
}
