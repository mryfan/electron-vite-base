import type { IpcMainInvokeEvent } from "electron";
import http from "http";
import type { RequestOptions } from "http";
import type { createContainerRequestBody } from "@/stores/docker-project/create-compose-file";
import type ElectronStore from "electron-store";

function sendHttpRequest(
  requestBody: createContainerRequestBody,
  store: ElectronStore,
  encoding: BufferEncoding = "utf8"
) {
  let options: RequestOptions = {};
  if (process.platform == "darwin") {
    options = {
      path: `/v1.41/containers/create`,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      socketPath: store.get("docker_sock_path") as string,
    };
  } else {
    options = {
      hostname: "127.0.0.1",
      path: `/v1.41/containers/create`,
      port: "2375",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    };
  }

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
        if (response.statusCode == 201) {
          resolve({ result: true, data });
        } else {
          reject(JSON.stringify({ result: false, errmsg: data }));
        }
      });
    });

    request.on("error", (e: Error) => {
      reject(JSON.stringify({ result: false, errmsg: e.message }));
    });
    request.write(JSON.stringify(requestBody));
    request.end();
  });
}
export async function handle(
  event: IpcMainInvokeEvent,
  requestBody: createContainerRequestBody,
  store: ElectronStore
) {
  const res = sendHttpRequest(requestBody, store);
  return res;
}
