import { ipcMain } from "electron";
import { handle as pingHandle } from "./ipcHandle/ping";
import { handle as httpRequestSearchImagesHandle } from "./ipcHandle/http_request_search_images";

export function handle() {
  ipcMain.handle("ping", pingHandle);
  ipcMain.handle("http_request_search_images", httpRequestSearchImagesHandle);
}
