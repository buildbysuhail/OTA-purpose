const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, protocol, session } = require("electron");
const fs = require("fs");
const path = require("path");

console.log("APP PATH:", process.cwd());

app.whenReady().then(() => {
  // autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.checkForUpdates();

  autoUpdater.on("update-available", () => {
    log.info("Update available");
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded, restarting...");
    autoUpdater.quitAndInstall();
  });

});

// Allow renderer to read file:// assets when packaged.
app.commandLine.appendSwitch("allow-file-access-from-files");
// Use a custom scheme to avoid file:// restrictions in packaged builds.
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

function createWindow() {
  const isDev = !app.isPackaged;
  const devServerUrl =
    process.env.VITE_DEV_SERVER_URL ||
    process.env.ELECTRON_RENDERER_URL ||
    process.env.DEV_SERVER_URL;

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        // Needed for file:// loads in some Windows setups.
        allowFileAccessFromFileUrls: true
    }
  });

  if (isDev) {
    const url = devServerUrl || "http://localhost:5173";
    win.loadURL(url);
  } else {
    win.loadURL("app://./index.html");
  }
  
}

app.whenReady().then(() => {
  const buildRoot = path.join(app.getAppPath(), "build");

  const ses = session.defaultSession;
  ses.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders || {};
    if (details.url.startsWith("https://api.poldev.work/")) {
      headers["Access-Control-Allow-Origin"] = ["app://."];
      headers["Access-Control-Allow-Credentials"] = ["true"];
      headers["Access-Control-Allow-Methods"] = ["GET,POST,PUT,DELETE,OPTIONS"];
      headers["Access-Control-Allow-Headers"] = ["*"];
    }
    callback({ responseHeaders: headers });
  });

  protocol.registerFileProtocol("app", (request, callback) => {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname || "/");
    if (pathname === "/") {
      pathname = "/index.html";
    }

    const resolvedPath = path.normalize(path.join(buildRoot, pathname));
    const isInsideBuild = resolvedPath.startsWith(buildRoot + path.sep);
    let filePath = isInsideBuild ? resolvedPath : path.join(buildRoot, "index.html");

    if (!fs.existsSync(filePath)) {
      filePath = path.join(buildRoot, "index.html");
    }

    callback({ path: filePath });
  });

  createWindow();
});
