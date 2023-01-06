import { ipcMain } from "electron";
import Store from "electron-store";
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

  //electron-store
  const store = new Store();
  ipcMain.handle("el_store_set", (event, key, value) => {
    store.set(key, value);
  });
  ipcMain.handle("el_store_get", (event, key) => {
    return store.get(key);
  });
  ipcMain.handle("el_store_delete", (event, key) => {
    return store.delete(key);
  });
}
