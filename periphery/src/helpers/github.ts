import { remove } from "fs-extra";
import { REPO_PATH } from "../config";
import { execute } from "./execute";

export async function cloneRepo(
  repoURL: string,
  branch: string,
  folderName: string,
  accessToken: string
) {
  await remove(REPO_PATH + folderName).catch();
  const cloneForLog =
    !branch || branch === "master"
      ? `git clone https://<TOKEN>@github.com/${repoURL}.git ${REPO_PATH}${folderName}`
      : `git clone https://<TOKEN>@github.com/${repoURL}.git ${REPO_PATH}${folderName} -b ${branch}`;
  const clone =
    !branch || branch === "master"
      ? `git clone https://${accessToken}@github.com/${repoURL}.git ${REPO_PATH}${folderName}`
      : `git clone https://${accessToken}@github.com/${repoURL}.git ${REPO_PATH}${folderName} -b ${branch}`;
  return { ...(await execute(clone)), command: cloneForLog };
}

export async function pullRepo(folderName: string, branch: string) {
  const command = `cd ${REPO_PATH}${folderName} && git pull origin ${branch}`;
	return await execute(command);
}

export async function deleteRepo(folderName: string) {
	await remove(REPO_PATH + folderName);
}
