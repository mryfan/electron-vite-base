import type { IpcMainInvokeEvent } from "electron";
import http from "http";
import type { removeContainerRequestBody } from "@/stores/docker-project/create-compose-file";

function sendHttpRequest(
  requestBody: removeContainerRequestBody,
  encoding: BufferEncoding = "utf8"
) {
  const options = {
    hostname: "127.0.0.1",
    path: `/v1.41/containers/${requestBody.id}?force=${requestBody.force}`,
    port: "2375",
    method: "DELETE",
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
        if (response.statusCode == 204) {
          resolve({ result: true, data });
        } else {
          reject(JSON.stringify({ result: false, errmsg: data }));
        }
      });
    });

    request.on("error", (e: Error) => {
      reject(JSON.stringify({ result: false, errmsg: e.message }));
    });
    request.end();
  });
}
export async function handle(
  event: IpcMainInvokeEvent,
  requestBody: removeContainerRequestBody
) {
  const res = sendHttpRequest(requestBody);
  return res;
}
