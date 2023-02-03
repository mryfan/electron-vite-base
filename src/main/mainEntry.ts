import { app, BrowserWindow } from "electron";
import path from "path";
import { handle as ipcMainHandle } from "./ipcMainHandle";

// 禁用当前应用程序的硬件加速,解决控制台显示 “Passthrough is not supported, GL is disabled” 的问题
app.disableHardwareAcceleration();
//用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。
// process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1470,
    minWidth: 1470,
    height: 901,
    minHeight: 900,
    webPreferences: {
      preload: path.join(__dirname, "../preload/main.js"),
    },
    icon: path.join(__dirname, "../../public/logo.jpg"),
    titleBarStyle: process.platform == "darwin" ? "hidden" : "default",
  });
  mainWindow.webContents.openDevTools({ mode: "right" });
  // mainWindow.loadURL(process.argv[2]);
  mainWindow.loadURL("http://localhost:5173");
  ipcMainHandle(mainWindow);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
