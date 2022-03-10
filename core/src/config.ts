import { getNumberFromEnv } from "./helpers/general";

export const PORT = getNumberFromEnv("PORT", 2020);