import { ipcRenderer, contextBridge } from 'electron' // 导入 Electron 的 ipcRenderer 和 contextBridge 模块

// 使用 contextBridge.exposeInMainWorld 将 ipcRenderer 方法暴露给渲染进程的全局对象
// 这允许渲染进程通过 window 对象直接调用这些方法，从而避免了直接暴露 Node.js 功能给渲染进程的安全隐患
contextBridge.exposeInMainWorld('ipcRenderer', {
  // 用于监听主进程发送到渲染进程的消息
  on(...args) {
    const [channel, listener] = args // 获取频道名称和回调函数
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args)) // 监听事件，并将事件传递给回调
  },

  // 用于移除监听主进程消息的事件
  off(...args) {
    const [channel, ...omit] = args // 获取频道名称和其他参数
    return ipcRenderer.off(channel, ...omit) // 移除监听指定频道的事件
  },

  // 用于向主进程发送消息
  send(...args) {
    const [channel, ...omit] = args // 获取频道名称和其他参数
    return ipcRenderer.send(channel, ...omit) // 发送消息到主进程
  },

  // 用于调用主进程的异步方法并等待返回结果
  invoke(...args) {
    const [channel, ...omit] = args // 获取频道名称和其他参数
    return ipcRenderer.invoke(channel, ...omit) // 调用主进程的异步方法并返回结果
  }
})
