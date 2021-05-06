'use strict'

import { app, protocol, BrowserWindow, nativeTheme } from 'electron'
import {default as installExtension, VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import { join } from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

app.commandLine.appendSwitch('proxy-server', '127.0.0.1:1080') // FIXME: just for development

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env;

let mainWindow: BrowserWindow | null = null;

async function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, '../../preload/dist/index.cjs'),

            // Required for Spectron testing
            enableRemoteModule: true,

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,

            // A workaround, see: https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1285
            contextIsolation: false,

            // disable the same-origin policy for the use of netease api
            webSecurity: false
        }
    })

    nativeTheme.themeSource = 'light' // otherwise it will auto use dark theme in my KDE.

    /**
     * If you install `show: true` then it can cause issues when trying to close the window.
     * Use `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    // mainWindow.on('ready-to-show', () => {
    //     mainWindow?.show();

    //     if (env.MODE === 'development') {
    //         mainWindow?.webContents.openDevTools();
    //     }
    // });

    await mainWindow.loadURL(env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = env.MODE === 'development'
        ? env.VITE_DEV_SERVER_URL
        : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
        try {
            // See: https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/776#issuecomment-751460206
            // Vue 2 and Vue 3 devtools are not the same extension
            await installExtension(VUEJS3_DEVTOOLS, {
                loadExtensionOptions: {
                    allowFileAccess: true,
                },
            })
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    await import('./ipcMain')
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
