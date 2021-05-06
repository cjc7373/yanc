import * as api from 'NeteaseCloudMusicApi'
import { ipcMain } from 'electron'
import debug from 'debug'

const d = debug('main')

async function rejectTimeout (timeOut = 60000) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`request time out after ${timeOut} ms`))
        }, timeOut)
    })
}

ipcMain.handle('api', async (event, methodName: keyof typeof api, data: object) => {
    d('Receive %s %O', methodName, data)
    const result: api.Response = await Promise.race([
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        api[methodName](data),
        rejectTimeout()
    ])
    d('Send %s %O', methodName, result)
    return result
})
