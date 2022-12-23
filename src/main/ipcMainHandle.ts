import { ipcMain } from "electron";
import { handle as pingHandle } from "./ipcHandle/ping";
import { handle as httpRequestSearchImagesHandle } from "./ipcHandle/http_request_search_images";
import { handle as httpRequestSearchImageTagsHandle } from "./ipcHandle/http_request_search_image_tags";
import { handle as httpRequestImageCreateHandle } from "./ipcHandle/http_request_image_create";

export function handle() {
  ipcMain.handle("ping", pingHandle);
  ipcMain.handle("http_request_search_images", httpRequestSearchImagesHandle);
  ipcMain.handle(
    "http_request_search_image_tags",
    httpRequestSearchImageTagsHandle
  );
  ipcMain.handle("http_request_image_create", httpRequestImageCreateHandle);
}
