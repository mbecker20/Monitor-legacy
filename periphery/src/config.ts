import { getNumberFromEnv, getStringFromEnv } from "./helpers/general";

export const ROOT = "/rootDir/";
export const REPO_PATH = ROOT + "repos/";
export const SYSROOT = getStringFromEnv("SYSROOT", "/home/ubuntu/");
export const DEPLOYDATA_ROOT = "deployments/";

export const PORT = getNumberFromEnv("PORT", 6060);


export const REGISTRY_URL = getStringFromEnv("REGISTRY_URL", "/");

