import { ipcRenderer, contextBridge } from 'electron'


// See: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('ipcRenderer', {
//   send: (channel, data) => {
//     // whitelist channels
//     const validChannels = ['toMain']
//     if (validChannels.includes(channel)) {
//       ipcRenderer.send(channel, data)
//     }
//   },
//   receive: (channel, func) => {
//     const validChannels = ['fromMain']
//     if (validChannels.includes(channel)) {
//       // Deliberately strip event as it includes `sender`
//       ipcRenderer.on(channel, (event, ...args) => func(...args))
//     }
//   }
// })

window.ipcRenderer = ipcRenderer
