import type { ContextBridge } from "electron";
import { ipcRenderer } from "electron";

export function aaa(contextBridge: ContextBridge) {
  contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke("ping"),
  });
}
