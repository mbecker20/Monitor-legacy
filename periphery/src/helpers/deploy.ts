import { DEPLOYDATA_ROOT, REGISTRY_URL, SYSROOT } from "../config";
import { execute } from "./execute";

export async function deployContainer(deployment: Deployment, build?: Build) {
	const command = createDockerRun(deployment, build);
	return { command, ...(await execute(command)) };
}

function createDockerRun(
  {
    buildID,
    image,
    latest,
    ports,
    environment,
    network,
    volumes,
    restart,
    postImage,
    containerName,
    folderName,
  }: Deployment,
  build?: Build, // use for custom build
) {
  const _image = build ? REGISTRY_URL + build.imageName : image;
  return (
    `docker pull ${_image}${buildID || latest ? ":latest" : ""} && ` +
    `docker run -d --name ${containerName}` +
    // containerUserString(containerUser) +
    portsString(ports) +
    volsString(folderName, volumes) +
    envString(environment) +
    // logString(containerName, logToAWS) +
    restartString(restart) +
    networkString(network) +
    ` ${_image}${buildID || latest ? ":latest" : ""}${
      postImage ? " " + postImage : ""
    }`
  );
}

function portsString(ports?: Conversion[]) {
  return ports && ports.length > 0
    ? ports
        .map(({ local, container }) => ` -p ${local}:${container}`)
        .reduce((prev, curr) => prev + curr)
    : "";
}

function volsString(folderName: string, volumes?: Volume[]) {
  const rootDir = SYSROOT;
  return volumes && volumes.length > 0
    ? volumes
        .map(({ local, container, useSystemRoot }) => {
          const mid = useSystemRoot ? "" : `${DEPLOYDATA_ROOT}${folderName}/`;
          const localString =
            local.length > 0
              ? local[0] === "/"
                ? local.slice(1, local.length)
                : local
              : "";
          return ` -v ${rootDir + mid + localString}:${container}`;
        })
        .reduce((prev, curr) => prev + curr)
    : "";
}

function restartString(restart?: string) {
  return restart
    ? ` --restart=${restart}${restart === "on-failure" ? ":10" : ""}`
    : "";
}

function envString(environment?: EnvironmentVar[]) {
  return environment && environment.length > 0
    ? environment
        .map(({ variable, value }) => ` -e "${variable}=${value}"`)
        .reduce((prev, curr) => prev + curr)
    : "";
}

function networkString(network?: string) {
  return network ? ` --network=${network}` : "";
}

