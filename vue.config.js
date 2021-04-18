module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            // This is necessary otherwise "Uncaught Error: Invalid package node_modules/electron/dist/resources/electron.asar" will be emitted.
            externals: ['NeteaseCloudMusicApi'],
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules']
        }
    }
}
