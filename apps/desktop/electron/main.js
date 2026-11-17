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
    show: process.env.ARDIA_BACKGROUND !== "1",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    ...(process.platform === "win32" && {
      icon: path.join(__dirname, "../assets/icon.png"),
    }),
  });

  win.webContents.on("did-fail-load", (_event, code, description, url) => console.error("load failed", { code, description, url }));
  win.webContents.on("render-process-gone", (_event, details) => console.error("renderer stopped", details));
  if (process.env.ARDIA_SMOKE === "1") {
    let lastError;
    const timeout = setTimeout(() => {
      console.error("render smoke test timed out", lastError);
      app.exit(1);
    }, 30000);
    win.webContents.once("did-finish-load", async () => {
      const waitForRender = async () => {
        try {
          const rendered = await win.webContents.executeJavaScript("document.querySelector(\"#root\")?.childElementCount === 1 && document.body.innerText.length > 0");
          if (rendered) {
            clearTimeout(timeout);
            console.log("render smoke test passed");
            app.exit(0);
            return;
          }
        } catch (error) {
          lastError = error;
        }
        setTimeout(waitForRender, 100);
      };
      await waitForRender();
    });
  }
  win.loadURL("ardia://app/index.html").catch((error) => console.error("startup failed", error));

  win.webContents.setWindowOpenHandler(({ url }) => {
    const scheme = new URL(url).protocol;
    if (scheme === "https:" || scheme === "http:") shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith("ardia://app/")) return;
    event.preventDefault();
    const scheme = new URL(url).protocol;
    if (scheme === "https:" || scheme === "http:") shell.openExternal(url);
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
