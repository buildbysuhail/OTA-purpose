const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  appVersion: () => process.version
});
