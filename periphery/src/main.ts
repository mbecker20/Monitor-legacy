import express from "@feathersjs/express";
import feathers from "@feathersjs/feathers";
import Dockerode from "dockerode";
import { PORT } from "./config";
import routes from "./routes";

export const dockerode = new Dockerode();

const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

app.configure(routes);

app
  .listen(PORT)
  .on("listening", () =>
    console.log("monitor peripheral client on port", PORT)
  );
