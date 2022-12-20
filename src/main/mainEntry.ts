import { app, BrowserWindow } from "electron";

//用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  const config = {
    webPreferences: {
      nodeIntegration: true, //nodeIntegration配置项的作用是把 Node.js 环境集成到渲染进程中
      //   webSecurity: false,
      //   allowRunningInsecureContent: true,
      contextIsolation: false, //配置项的作用是在同一个 JavaScript 上下文中使用 Electron API
      //   webviewTag: true,
      //   spellcheck: false,
      //   disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  mainWindow.loadURL(process.argv[2]);
});
