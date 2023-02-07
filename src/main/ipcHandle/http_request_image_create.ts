import type { IpcMainInvokeEvent, BrowserWindow } from "electron";
import http from "http";
import type { RequestOptions } from "http";
import type ElectronStore from "electron-store";

function sendHttpRequest(
  mainWindow: BrowserWindow,
  imageName: string,
  imageTag: string,
  store: ElectronStore,
  encoding: BufferEncoding = "utf8"
) {
  let options: RequestOptions = {};
  if (process.platform == "darwin") {
    options = {
      path: `/v1.41/images/create?fromImage=${imageName}&tag=${imageTag}`,
      method: "POST",
      socketPath: store.get("docker_sock_path") as string,
    };
  } else {
    options = {
      hostname: "127.0.0.1",
      path: `/v1.41/images/create?fromImage=${imageName}&tag=${imageTag}`,
      port: "2375",
      method: "POST",
      headers: {},
    };
  }

  let data = "";
  return new Promise(function (resolve, reject) {
    const req = http.request(options, function (res) {
      res.setEncoding(encoding);
      res.on("data", function (chunk) {
        mainWindow.webContents.send("update-image-create-log", chunk);
        data += chunk;
      });

      res.on("end", function () {
        resolve({ result: true, data });
      });
    });

    req.on("error", (e) => {
      reject({ result: false, errmsg: e.message });
    });
    req.end();
  });
}
export async function handle(
  event: IpcMainInvokeEvent,
  imageName: string,
  imageTag: string,
  mainWindow: BrowserWindow,
  store: ElectronStore
) {
  const res = sendHttpRequest(mainWindow, imageName, imageTag, store);
  return res;
}
