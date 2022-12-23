import type { IpcMainInvokeEvent } from "electron";
import http from "http";

function sendHttpRequest(
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
        data += chunk;
      });

      res.on("end", function () {
        resolve({ result: true, data: JSON.parse(data) });
      });
    });

    req.on("error", (e) => {
      resolve({ result: false, errmsg: e.message });
    });
    req.end();
  });
}
export async function handle(
  event: IpcMainInvokeEvent,
  imageName: string,
  imageTag: string
) {
  console.log("imageName", imageName);
  console.log("imageTag", imageTag);
  const res = await sendHttpRequest(imageName, imageTag);
  console.log(res);
  return res;
}
