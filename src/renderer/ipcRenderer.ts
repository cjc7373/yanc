// import { ipcRenderer } from 'electron'

const ipcRenderer = window.ipcRenderer

async function send (methodName: any, data: any) {
    console.log(`sending ${methodName}, the data is`, data)
    const cookie = localStorage.getItem('cookie')
    if (cookie) {
        if (data) {
            data.cookie = cookie
        } else {
            data = { cookie: cookie }
        }
    }

    const result = await ipcRenderer.invoke('api', methodName, data)
    console.log(`received  ${methodName}, the result is:`, result)
    if (methodName === 'login' && result.status === 200) {
        localStorage.setItem('cookie', result.body.cookie)
    }
    return result
}

const api: any = new Proxy({}, {
    get (_, propName) {
        return send.bind(null, propName)
    }
})

export default api

export function reloadApp(): void {
    ipcRenderer.invoke('reload app')
}
