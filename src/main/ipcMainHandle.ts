import type {
  createContainerRequestBody,
  inspectImageParamsType,
  removeContainerRequestBody,
} from "@/stores/docker-project/create-compose-file";

import { ipcMain } from "electron";
import Store from "electron-store";
import fs from "fs";
import { handle as pingHandle } from "./ipcHandle/ping";
import { handle as httpRequestSearchImagesHandle } from "./ipcHandle/http_request_search_images";
import { handle as httpRequestSearchImageTagsHandle } from "./ipcHandle/http_request_search_image_tags";
import { handle as httpRequestImageCreateHandle } from "./ipcHandle/http_request_image_create";
import { handle as httpRequestImageBuildHandle } from "./ipcHandle/http_request_image_build";
import type { imageBuildOption } from "./ipcHandle/http_request_image_build";
import { handle as dockerCreateContainer } from "./ipcHandle/docker_create_container";
import { handle as dockerRemoveContainer } from "./ipcHandle/docker_remove_container";
import { handle as dockerInspectImage } from "./ipcHandle/docker_inspect_image";
import { handle as execCmd } from "./ipcHandle/exec-cmd";
import { handle as showOpenDialogHandle } from "./ipcHandle/show_open_dialog";
import { handle as getTempDirHandle } from "./ipcHandle/get_temp_dir";
import { handle as tarParamsWithCZFHandle } from "./ipcHandle/tar_czf";
import type { BrowserWindow, IpcMainInvokeEvent } from "electron";

export function handle(mainWindow: BrowserWindow) {
  ipcMain.handle("ping", pingHandle);
  ipcMain.handle("http_request_search_images", httpRequestSearchImagesHandle);
  ipcMain.handle(
    "http_request_search_image_tags",
    httpRequestSearchImageTagsHandle
  );
  ipcMain.handle(
    "http_request_image_create",
    (event: IpcMainInvokeEvent, imageName: string, imageTag: string) => {
      return httpRequestImageCreateHandle(
        event,
        imageName,
        imageTag,
        mainWindow
      );
    }
  );
  ipcMain.handle(
    "http_request_image_build",
    (event: IpcMainInvokeEvent, imageBuildOptionData: imageBuildOption) => {
      return httpRequestImageBuildHandle(
        event,
        imageBuildOptionData,
        mainWindow
      );
    }
  );

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

  //node   fs 处理
  ipcMain.handle("fs_stat", (event, path: string) => {
    try {
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        return { status: true, message: "" };
      } else {
        return { status: false, message: "当前路径不是一个目录,请重新填写" };
      }
    } catch (error) {
      try {
        fs.mkdirSync(path, { recursive: true });
        return { status: true, message: "" };
      } catch (error) {
        return { status: false, message: `创建目录${path}失败,请检查` };
      }
    }
  });

  ipcMain.handle(
    "fs_create_file",
    (event, fileName: string, content: string) => {
      fs.writeFileSync(fileName, content);
    }
  );

  //docker  创建容器处理
  ipcMain.handle(
    "docker_create_container",
    (event, requestBody: createContainerRequestBody) => {
      return dockerCreateContainer(event, requestBody);
    }
  );
  //docker  删除容器处理
  ipcMain.handle(
    "docker_remove_container",
    (event, requestBody: removeContainerRequestBody) => {
      return dockerRemoveContainer(event, requestBody);
    }
  );
  //docker  检查镜像处理
  ipcMain.handle(
    "docker_inspect_image",
    (event, paramsData: inspectImageParamsType) => {
      return dockerInspectImage(event, paramsData);
    }
  );
  //执行CMD命令处理
  ipcMain.handle("exec_cmd", (event, cmd: string) => {
    return execCmd(event, cmd);
  });
  //处理系统对话框
  ipcMain.handle("electron_api_dialog_showOpenDialog", showOpenDialogHandle);

  //处理node相关api组
  ipcMain.handle("node_temp_dir", getTempDirHandle);

  //处理tar相关api组
  ipcMain.handle("tar_czf", tarParamsWithCZFHandle);
}
