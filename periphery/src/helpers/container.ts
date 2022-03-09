import { dockerode } from "../main";
import { execute } from "./execute";
import { objFrom2Arrays } from "./general";

export async function allContainerStatus() {
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

export async function getContainerStatus(name: string) {
  const status = (await dockerode.listContainers({ all: true })).filter(
    ({ Names }) => Names[0] === "/" + name
  );
  return status[0]
    ? {
        State: status[0].State,
        Status: status[0].Status,
        name,
      }
    : "not created";
}

export async function getContainerLog(
  containerName: string,
  logTail?: number
) {
  return (
    await execute(
      `docker logs ${containerName}${
        logTail ? ` --tail ${logTail}` : ""
      }`
    )
  ).log;
}
