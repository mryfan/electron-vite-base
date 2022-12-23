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
