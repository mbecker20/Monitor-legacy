import { deleteContainer, deployContainer, startContainer, stopContainer } from "../helpers/deploy";

export class DeploymentService {
	async create({ deployment, build }: { deployment: Deployment; build: Build }) {
		return await deployContainer(deployment, build)
	}

	async update(containerName: string, type: "start" | "stop") {
		switch (type) {
			case "start": return await startContainer(containerName);
			case "stop": return await stopContainer(containerName);
		}
	}

	async remove(containerName: string) {
		return await deleteContainer(containerName)
	}
}