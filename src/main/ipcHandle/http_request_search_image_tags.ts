import type { IpcMainInvokeEvent } from "electron";
import https from "https";

function sendHttpRequest(q: string, encoding: BufferEncoding = "utf8") {
  const options = {
    hostname: "hub.docker.com",
    path: `/v2/repositories/${q}/tags?os=linux&page_size=15`,
    port: "443",
    method: "GET",
    headers: {},
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
  console.log(q);
  const res = await sendHttpRequest(q);
  console.log(res);
  return res;
}
