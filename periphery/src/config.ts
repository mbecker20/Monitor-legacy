import { getNumberFromEnv } from "./helpers/general";

export const PORT = getNumberFromEnv("PORT", 6060);
