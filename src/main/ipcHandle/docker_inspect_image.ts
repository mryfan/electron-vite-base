import type { IpcMainInvokeEvent } from "electron";
import http from "http";
import type { inspectImageParamsType } from "@/stores/docker-project/create-compose-file";

function sendHttpRequest(
  requestBody: inspectImageParamsType,
  encoding: BufferEncoding = "utf8"
) {
  const options = {
    hostname: "127.0.0.1",
    path: `/v1.41/images/${requestBody.image_name}:${requestBody.image_tag}/json`,
    port: "2375",
    method: "GET",
    headers: {},
  };

  let data = "";
  return new Promise<{ result: boolean; data?: string }>(function (
    resolve,
    reject
  ) {
    const request = http.request(options, function (response) {
      response.setEncoding(encoding);
      response.on("data", function (chunk) {
        data += chunk;
      });

      response.on("end", function () {
        if (response.statusCode == 200) {
          resolve({ result: true, data });
        } else if (response.statusCode == 404) {
          resolve({ result: false, data });
        } else {
          reject({ result: false, errmsg: data });
        }
      });
    });

    request.on("error", (e: Error) => {
      reject({ result: false, errmsg: e.message });
    });
    request.end();
  });
}
export async function handle(
  event: IpcMainInvokeEvent,
  requestBody: inspectImageParamsType
) {
  const res = sendHttpRequest(requestBody);
  return res;
}
