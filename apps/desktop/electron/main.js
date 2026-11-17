const { app, BrowserWindow, net, protocol, shell } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

if (require("electron-squirrel-startup")) app.quit();

protocol.registerSchemesAsPrivileged([{ scheme: "ardia", privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);

const webRoot = path.resolve(__dirname, "../web");

function serveApp(request) {
  const url = new URL(request.url);
  const target = path.resolve(webRoot, "." + decodeURIComponent(url.pathname));
  if (url.host !== "app" || (target !== webRoot && !target.startsWith(webRoot + path.sep))) {
    return new Response("Not found", { status: 404 });
  }
  return net.fetch(pathToFileURL(target).toString());
}

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

  win.loadURL("ardia://app/index.html");

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  await protocol.handle("ardia", serveApp);
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
