# ly-electron-cli

一个用于创建 Vite + Vue + Electron 快速启动项目的命令行工具。

## 安装

```bash
npm install -g ly-electron-cli
```

## 使用方法

### 初始化项目

使用以下命令来创建一个新项目：

```bash
vite-electron init
```

初始化时将提示你输入项目名称，并选择是否安装依赖。

### 示例流程

1. 执行命令：

   ```bash
   vite-electron init
   ```

2. 按提示输入项目名称和应用名称，例如：`my-app`

3. 是否安装依赖？选择 `Yes`

4. 然后脚手架将会：

   - 创建项目目录 `my-app`
   - 拷贝模板文件到该目录
   - 生成 `package.json`
   - 自动安装依赖（如果选择了安装）

5. 创建成功后，提示接下来的操作：

   - 进入项目目录：

     ```bash
     cd my-app
     ```

   - 如果之前没有安装依赖，可手动安装：

     ```bash
     npm install
     ```

   - 启动开发环境：

     ```bash
     npm run dev
     ```

   - 打包项目：

     ```bash
     npm run build
     ```

## 文件结构说明

```
my-app/
├── build/
│   └── favicon.ico                 # 打包结果的图标
├── electron/
│   ├── main.js                     # Electron 主进程入口
│   └── preload.js                  # 预加载脚本
├── public/
│   ├── favicon.ico                 # 应用窗口图标
│   ├── vite.svg
│   └── vue.svg
├── src/
│   ├── components/
│   |   └── HelloWorld.vue
│   ├── App.vue
│   ├── main.js                     # 渲染进程入口
│   └── style.css
├── electron-builder.json5          # Electron 构建配置
├── index.html
├── init.cjs                        # 打包前置初始化操作
├── jsconfig.json
└── vite.config.js                  # Vite 配置
```

## 注意事项

- 本脚手架基于 Node.js，请确保你的 Node.js 版本 >= 16
- 项目结构基于 Vite 和 Electron 最佳实践，适合用于桌面应用开发

---

Made with ❤️ by ly-electron-cli