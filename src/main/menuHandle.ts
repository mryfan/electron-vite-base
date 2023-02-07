import { Menu, type MenuItemConstructorOptions } from "electron";

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

export function menuHandle() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
