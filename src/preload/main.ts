import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
});

contextBridge.exposeInMainWorld("http_request", {
  search_images: (q: string) =>
    ipcRenderer.invoke("http_request_search_images", q),
  search_image_tags: (q: string) =>
    ipcRenderer.invoke("http_request_search_image_tags", q),
  image_create: (imageName: string, imageTag: string) =>
    ipcRenderer.invoke("http_request_image_create", imageName, imageTag),
});

//加载electron-store 方法
contextBridge.exposeInMainWorld("el_store", {
  set: (key: string, value: string | Object | Boolean) =>
    ipcRenderer.invoke("el_store_set", key, value),
  get: (key: string) => ipcRenderer.invoke("el_store_get", key),
  delete: (key: string) => ipcRenderer.invoke("el_store_delete", key),
});

//调用fs的方法
contextBridge.exposeInMainWorld("fs", {
  stat: (path: string) => ipcRenderer.invoke("fs_stat", path),
});
