import {
  allContainerStatus,
  getContainerLog,
  getContainerStatus,
} from "../helpers/container";
import { deployContainer } from "../helpers/deploy";

export class ContainerService {
  async find() {
    // returns status of all containers running on server
    return await allContainerStatus();
  }

  async get(
    containerName: string,
    { query: { log, tail } }: { query: { log?: "true"; tail?: string } }
  ) {
    // returns status of one container by name, or log of container
    // eg /containers/${name}?log="true"&tail=500
    if (log === "true") {
      return await getContainerLog(
        containerName,
        tail ? Number(tail) : undefined
      );
    } else {
      return await getContainerStatus(containerName);
    }
  }

  async create({
    deployment,
    build,
  }: {
    deployment: Deployment;
    build?: Build;
  }) {
    const deployRes = await deployContainer(deployment, build);
  }
}
