import type { IpcMainInvokeEvent } from "electron";
import https from "https";

function sendHttpRequest(q: string, encoding: BufferEncoding = "utf8") {
  const options = {
    hostname: "hub.docker.com",
    path: `/api/content/v1/products/search?page_size=25&q=${q}`,
    port: "443",
    method: "GET",
    headers: {
      "Search-Version": "v3",
    },
  };

  let data = "";
  return new Promise(function (resolve, reject) {
    const req = https.request(options, function (res) {
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
export async function handle(event: IpcMainInvokeEvent, q: string) {
  const res = await sendHttpRequest(q);
  return res;
}
