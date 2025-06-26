const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  switchService: (index) => ipcRenderer.send('switch-service', index)
});
