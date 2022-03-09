import configureApp from "./configure/configureApp"
import Dockerode from "dockerode"
import setup from "./setup"
import { pathExistsSync } from "fs-extra"
import { FRONTEND_REPO, REPO_PATH, SYSTEM_OPERATOR } from "./const"
import websocketManager from "./sockets/websocket"
import { Server } from "http"
import { Application } from "./types/feathers"
import { addRootSocket } from "./sockets/rootSocket"
import makeActionStateManager from "./helpers/actionStateManager"
import { toFolderName } from "./helpers/general"
import { executeLocal } from "./helpers/execute"
import { findServers, pruneServer } from "./services/servers"
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

// docker js helper
export const dockerode = new Dockerode()

export const { addBuildActionState, addDeployActionState, getBuildActionState, getMultiBuildActionState, setBuildActionState, getDeployActionState, getMultiDeployActionState, setDeployActionState, setupActionStateManager } = makeActionStateManager()

export const { addSocket, addSocketWithTimeout, deleteSocket, broadcast, broadcastGivenWS, setup: setupWebSockets } = websocketManager()

/* Create express server hosting feathers application */
async function main(retry: boolean): Promise<{ app: Application; server: Server }> {
	try {
		await executeLocal('git config --global user.name "MoghTech"')
		await executeLocal('git config --global user.email "moghtech@gmail.com"')
		// await executeLocal(`gh auth login --with-token < /usr/src/app/gh-token.txt`)
		await executeLocal(`cat /usr/src/app/docker-pass.txt | docker login --username mbecker2020 --password-stdin`)
		await new Promise((res, rej) => {
			const frontendOK = pathExistsSync(REPO_PATH + toFolderName(FRONTEND_REPO))
			if (frontendOK) {
				res(true)
			} else {
				rej(false)
			}
		})
		const app = configureApp()
		const server = app.listen(Number(app.get("port"))).on("listening", async () => {
			console.log()
			console.log(`server listening on ${app.get("host")}`)
			console.log()
		})

		return {
			app,
			server,
		}
	} catch (err) {
		if (!retry) {
			await setup()
			return main(true)
		} else {
			console.log(err)
			process.exit(1)
		}
	}
}

main(false).then(async ({ app, server }) => {
	await setupActionStateManager()
	addRootSocket(app)
	setupWebSockets(server)

	// prune the servers every day
	setInterval(async () => {
		const servers = (await findServers()) as { [id: string]: Server }
		Object.keys(servers).map((serverID) => {
			pruneServer(serverID, SYSTEM_OPERATOR, 1, "")
		})
	}, 1000 * 60 * 60 * 24)

	console.log()
	console.log(`finished setup. monitor is now ready to be used`)
	console.log()
})
