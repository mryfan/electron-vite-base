import type { IpcMainInvokeEvent, BrowserWindow } from "electron";
import http from "http";

function sendHttpRequest(
  mainWindow: BrowserWindow,
  imageName: string,
  imageTag: string,
  encoding: BufferEncoding = "utf8"
) {
  const options = {
    hostname: "127.0.0.1",
    path: `/v1.41/images/create?fromImage=${imageName}&tag=${imageTag}`,
    port: "2375",
    method: "POST",
    headers: {},
  };

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
) {
  const res = sendHttpRequest(mainWindow, imageName, imageTag);
  return res;
}
