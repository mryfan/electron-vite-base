import { ipcMain } from "electron";
import { handle as pingHandle } from "./ipcHandle/ping";
export function handle() {
  ipcMain.handle("ping", pingHandle);
}
