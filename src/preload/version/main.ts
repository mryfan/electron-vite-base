import type { ContextBridge } from "electron";

export function aaa(contextBridge: ContextBridge) {
  contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  });
}
