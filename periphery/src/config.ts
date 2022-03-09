import { getNumberFromEnv, getStringFromEnv } from "./helpers/general";

export const PORT = getNumberFromEnv("PORT", 6060);

export const SYSROOT = getStringFromEnv("SYSROOT", "/");

export const DEPLOYDATA_ROOT = "";

export const REGISTRY_URL = getStringFromEnv("REGISTRY_URL", "/");
