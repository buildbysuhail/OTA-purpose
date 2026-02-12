const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, protocol, session } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

// Allow file access
app.commandLine.appendSwitch("allow-file-access-from-files");

// Register custom protocol BEFORE ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function createWindow() {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadURL("app://./index.html");
  }
}

app.whenReady().then(() => {

  // ✅ Auto updater
  autoUpdater.checkForUpdatesAndNotify();

  // ✅ Fix CORS for API
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders || {};
    if (details.url.startsWith("https://api.poldev.work/")) {
      headers["Access-Control-Allow-Origin"] = ["app://."];
      headers["Access-Control-Allow-Credentials"] = ["true"];
    }
    callback({ responseHeaders: headers });
  });

  // ✅ PERFECT BrowserRouter support
  const distPath = path.join(app.getAppPath(), "dist");

  protocol.registerFileProtocol("app", (request, callback) => {
    let urlPath = request.url.replace("app://./", "");

    if (!urlPath || urlPath === "/") {
      urlPath = "index.html";
    }

    const filePath = path.join(distPath, urlPath);

    callback({
      path: fs.existsSync(filePath)
        ? filePath
        : path.join(distPath, "index.html"), // fallback for React routes
    });
  });

  createWindow();
});
