import type { IpcMainInvokeEvent, BrowserWindow } from "electron";
import http from "http";
import fs from "fs";

function sendHttpRequest(
  mainWindow: BrowserWindow,
  imageBuildOption: imageBuildOption,
  encoding: BufferEncoding = "utf8"
): Promise<{ result: boolean; data: string }> {
  const options = {
    hostname: "127.0.0.1",
    path: `/v1.41/build?t=${imageBuildOption.t}`,
    port: "2375",
    method: "POST",
    headers: {
      "content-type": "application/tar",
    },
  };

  console.log("imageBuildOption", imageBuildOption);
  let data = "";
  return new Promise(function (resolve, reject) {
    const req = http.request(options, function (res) {
      res.setEncoding(encoding);
      res.on("data", function (chunk) {
        mainWindow.webContents.send("update-image-build-log", chunk);
        console.log("chunk", chunk);
        data += chunk;
      });

      res.on("end", function () {
        resolve({ result: true, data });
      });
    });

    fs.createReadStream(
      "C:/Users/qianyi/AppData/Local/Temp/docker_file_temp_custom/Dockerfile.tar.gz"
    )
      .on("open", (chunk) => {
        console.log("open chunk", chunk);
      })
      .on("data", (chunk) => {
        console.log("data chunk", chunk);
        req.write(chunk); //发送数据
      })
      .on("end", () => {
        req.end(); //发送结束
      });

    req.on("error", (e) => {
      reject({ result: false, errmsg: e.message });
    });
  });
}

export async function handle(
  event: IpcMainInvokeEvent,
  imageBuildOption: imageBuildOption,
  mainWindow: BrowserWindow
) {
  const res = sendHttpRequest(mainWindow, imageBuildOption);
  return res;
}

export interface imageBuildOption {
  t: string;
  tarFilePath: string;
}
