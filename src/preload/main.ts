import { aaa } from "./version/main";
import { contextBridge } from "electron";

aaa(contextBridge);
// contextBridge.exposeInMainWorld("versions", {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
// });
