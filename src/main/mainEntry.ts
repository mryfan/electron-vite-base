import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
} from "electron";
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
    frame: false,
    titleBarStyle: process.platform == "darwin" ? "hiddenInset" : "hidden",
  });
  mainWindow.webContents.openDevTools({ mode: "right" });
  // mainWindow.loadURL(process.argv[2]);
  mainWindow.loadURL("http://localhost:5173");
  ipcMainHandle(mainWindow);
};

const template: Array<MenuItemConstructorOptions> = [
  {
    label: "Apipost",
    role: "windowMenu",
    submenu: [
      {
        label: "检查更新",
        // click() {
        //   mainWindow.webContents.send("action", "checkUpdate");
        // },
        accelerator: "CmdOrCtrl+U",
      },
      {
        type: "separator",
      },
      {
        label: "退出",
        role: "quit",
        accelerator: "CmdOrCtrl+Q",
      },
    ],
  },
  {
    label: "编辑",
    submenu: [
      {
        label: "撤销",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
      },
      {
        label: "重做",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        label: "复制",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "剪切",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "粘贴",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        type: "separator",
      },
      {
        label: "全选",
        accelerator: "CmdOrCtrl+A",
        role: "selectAll",
      },
    ],
  },
  {
    label: "关于",
    role: "help",
    submenu: [
      {
        label: "关于",
        // click() {
        //   mainWindow.webContents.send("windowMenuClick", "about");
        // },
      },
    ],
  },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

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
