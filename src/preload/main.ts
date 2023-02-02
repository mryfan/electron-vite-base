import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent, OpenDialogOptions } from "electron";
import type { CreateOptions } from "tar";
import type { imageBuildOption } from "../main/ipcHandle/http_request_image_build";
import type {
  createContainerRequestBody,
  inspectImageParamsType,
  removeContainerRequestBody,
} from "@/stores/docker-project/create-compose-file";

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
  image_build: (imageBuildOptionData: imageBuildOption) =>
    ipcRenderer.invoke("http_request_image_build", imageBuildOptionData),
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
  createFile: (fileName: string, content: string) =>
    ipcRenderer.invoke("fs_create_file", fileName, content),
  thePathIsEmptyDir: (path: string) =>
    ipcRenderer.invoke("fs_the_path_is_empty_dir", path),
});

//调用docker  api的方法
contextBridge.exposeInMainWorld("docker", {
  createContainer: (requestBody: createContainerRequestBody) =>
    ipcRenderer.invoke("docker_create_container", requestBody),
  inspectImage: (requestBody: inspectImageParamsType) =>
    ipcRenderer.invoke("docker_inspect_image", requestBody),
  removeContainer: (requestBody: removeContainerRequestBody) =>
    ipcRenderer.invoke("docker_remove_container", requestBody),
});

//主进程发送到渲染进程
contextBridge.exposeInMainWorld("main_send_to_render", {
  onUpdateImageCreateLog: (
    callback: (event: IpcRendererEvent, value: string) => void
  ) => ipcRenderer.on("update-image-create-log", callback),
  onUpdateImageBuildLog: (
    callback: (event: IpcRendererEvent, value: string) => void
  ) => ipcRenderer.on("update-image-build-log", callback),
});

//exec_cmd
contextBridge.exposeInMainWorld("exec", {
  cmd: (cmd: string) => ipcRenderer.invoke("exec_cmd", cmd),
});

//electron api
contextBridge.exposeInMainWorld("electron_api", {
  dialog_showOpenDialog: (option: OpenDialogOptions) =>
    ipcRenderer.invoke("electron_api_dialog_showOpenDialog", option),
});

//node api
contextBridge.exposeInMainWorld("node", {
  temp_dir: () => ipcRenderer.invoke("node_temp_dir"),
});

//tar api
contextBridge.exposeInMainWorld("tar", {
  tar_czf: (options: CreateOptions, fileList: Array<string>) =>
    ipcRenderer.invoke("tar_czf", options, fileList),
});
