// 从 electron 中导入必要模块
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
// 用于将 URL 转换为文件路径（ESM 模块中没有 __dirname，要手动实现）
import { fileURLToPath } from 'node:url'
// Node.js 的 path 模块，用于路径拼接
import path from 'node:path'

// 获取当前文件的目录名（替代 __dirname）
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 应用名
const APP_NAME = app.getName()

// 设置全局环境变量 APP_ROOT，指向项目根目录
process.env.APP_ROOT = path.join(__dirname, '..')

// 从环境变量读取开发模式下的 Vite 开发服务器地址
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// 设置主进程和渲染进程的构建输出目录
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

// 设置公共资源路径：开发模式下是 public，生产模式下是构建目录
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// 主窗口变量，用于后续窗口控制
let win = null
// 托盘图标变量
let tray = null

// 创建托盘图标及其菜单
function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC, 'favicon.ico') // 托盘图标路径
  tray = new Tray(iconPath)

  // 托盘右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开应用',
      click: () => win?.show() // 显示主窗口
    },
    {
      label: '退出',
      click: () => {
        tray?.destroy() // 移除托盘图标
        app.quit()      // 退出应用
      }
    }
  ])

  tray.setToolTip(APP_NAME)         // 设置鼠标悬停提示
  tray.setContextMenu(contextMenu)        // 设置右键菜单
  tray.on('double-click', () => win?.show()) // 双击托盘图标还原窗口
}

// 创建主窗口
function createWindow() {
  win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'), // 窗口图标
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs') // 预加载脚本
    }
  })

  // 拦截窗口关闭事件，最小化到托盘而不是退出应用
  win.on('close', (e) => {
    if (process.platform !== 'darwin') {
      e.preventDefault()
      win?.hide() // 隐藏窗口（最小化到托盘）
    }
  })

  // 创建系统托盘图标
  createTray()

  // 页面加载完成后，发送当前时间给渲染进程
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-loaded', APP_NAME)
  })

  // 开发模式：加载 Vite 本地服务器地址，并打开开发者工具
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
    return
  }

  // 生产模式：加载打包好的 HTML 页面
  win.loadFile(path.join(RENDERER_DIST, 'index.html'))
}

// 确保只运行一个实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 如果获取锁失败（说明已有实例运行），直接退出当前进程
  app.quit()
} else {
  // 如果获取锁成功，监听 second-instance 事件
  app.on('second-instance', (event, argv, workingDirectory) => {
    // 用户再次启动应用时，激活已存在的窗口
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
    }
  })

  // Electron 初始化完成后创建窗口
  app.whenReady().then(createWindow)
}

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

// macOS 特有：点击 Dock 图标重新打开应用窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length <= 0) {
    createWindow()
  }
})

// 接收渲染进程发来的消息并打印
ipcMain.on('render-process-message', (evt, ...args) => console.log(args))