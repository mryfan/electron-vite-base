import type { IpcMainInvokeEvent } from "electron";
import fs from "fs";

export interface thePathIsEmptyDirReType {
  status: boolean;
  message: string;
  code: "the_path_is_not_dir" | "the_path_is_not_empty_dir" | "";
}

export function handle(
  event: IpcMainInvokeEvent,
  path: string
): thePathIsEmptyDirReType {
  const stat = fs.statSync(path);
  if (!stat.isDirectory()) {
    return {
      status: false,
      code: "the_path_is_not_dir",
      message: "当前路径不是一个目录：" + path,
    };
  }
  const filesNameArray = fs.readdirSync(path);
  if (filesNameArray.length > 0) {
    return {
      status: false,
      code: "the_path_is_not_empty_dir",
      message: "当前路径不是一个空的目录：" + path,
    };
  }
  return { status: true, code: "", message: "" };
}
