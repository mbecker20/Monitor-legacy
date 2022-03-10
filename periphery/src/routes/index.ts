import { Application } from "@feathersjs/express";
import { ContainerService } from "./containers";
import { DeploymentService } from "./deploy";
import { GitService } from "./git";

export default function routes(app: Application) {
	app.use("/containers", new ContainerService());
	app.use("/deploy", new DeploymentService());
	app.use("/git", new GitService());
}