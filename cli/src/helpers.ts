import { exec } from "child_process";
import { promisify } from "util";
export const pExec = promisify(exec);

export async function execute(command: string) {
	try {
		return {
			log: await pExec(command),
			success: true,
		};
	} catch (err) {
		return {
			log: { stderr: JSON.stringify(err), stdout: "" },
			success: false,
		};
	}
}

export async function createRegistry() {

}

export async function createMongo() {
	
}