import { objFrom2Arrays } from "../helpers/general";
import { dockerode } from "../main";

export class ContainerService {
  async allContainerStatus() {
    const statusAr = await dockerode.listContainers({ all: true });
    const statusNames = statusAr.map((stat) =>
      stat.Names[0].slice(1, stat.Names[0].length)
    ); // they all start with '/'
    return objFrom2Arrays(
      statusNames,
      statusAr.map((stat, i) => ({
        name: statusNames[i],
        Status: stat.Status,
        State: stat.State,
      }))
    );
  }
}