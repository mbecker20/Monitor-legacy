import { exec } from "child_process";
import { promisify } from "util";

const pExec = promisify(exec);

export async function execute(command: string) {
  try {
    return {
      log: await pExec(command),
      command,
      success: true,
    };
  } catch (err) {
    return {
      log: { stderr: JSON.stringify(err), stdout: "" },
      command,
      success: false,
    };
  }
}
