import child_process from "child_process";
import type { IpcMainInvokeEvent } from "electron";

export function handle(event: IpcMainInvokeEvent, cmd: string = "") {
  return new Promise<{
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if (error != null) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
