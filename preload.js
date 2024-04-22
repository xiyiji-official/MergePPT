const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  initList: (value) => ipcRenderer.invoke("init-List", value),
  updateList: (value) => ipcRenderer.invoke("update-List", value),
  addFile: (file, value) => ipcRenderer.invoke("add-File", file, value),
});
