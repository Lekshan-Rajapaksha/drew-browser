const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

if (require("electron-squirrel-startup")) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 720,
    minHeight: 460,
    title: "Ardia",
    backgroundColor: "#18181b",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    ...(process.platform === "win32" && {
      icon: path.join(__dirname, "../assets/icon.png"),
    }),
    ...(process.platform === "darwin" && {
      icon: path.join(__dirname, "../assets/icon.icns"),
    }),
  });

  const indexPath = path.join(__dirname, "../web/index.html");
  win.loadFile(indexPath);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
