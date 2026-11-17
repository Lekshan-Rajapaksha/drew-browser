const { app, BrowserWindow, protocol, shell } = require("electron");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

if (require("electron-squirrel-startup")) app.quit();

protocol.registerSchemesAsPrivileged([{ scheme: "ardia", privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }]);

const webRoot = path.resolve(__dirname, "../web");
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

async function serveApp(request) {
  const url = new URL(request.url);
  const target = path.resolve(webRoot, "." + decodeURIComponent(url.pathname));
  if (url.host !== "app" || (target !== webRoot && !target.startsWith(webRoot + path.sep))) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const body = await readFile(target);
    const contentType = contentTypes.get(path.extname(target).toLowerCase()) ?? "application/octet-stream";
    return new Response(body, { headers: { "content-type": contentType } });
  } catch (error) {
    const status = error?.code === "ENOENT" ? 404 : 500;
    return new Response(status === 404 ? "Not found" : "Unable to load app resource", { status });
  }
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
  win.webContents.on("console-message", (details) => {
    if (process.env.ARDIA_SMOKE === "1" && details.level === "error") console.error("renderer error", details.message, details.sourceId, details.lineNumber);
  });
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
