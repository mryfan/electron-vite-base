import fs from "fs";
import tar from "tar";
import type { CreateOptions } from "tar";
import type { IpcMainInvokeEvent } from "electron";

export function handle(
  event: IpcMainInvokeEvent,
  options: CreateOptions,
  fileList: Array<string>
): Promise<{
  status: boolean;
  data: { bytes: number; writerPath: string | Buffer };
}> {
  return new Promise(function (resolve, reject) {
    const writer = fs.createWriteStream(`${options.cwd}/Dockerfile.tar.gz`);
    writer.on("close", () => {
      resolve({
        status: true,
        data: { bytes: writer.bytesWritten, writerPath: writer.path },
      });
    });

    tar.c(options, fileList).pipe(writer);
  });
}
