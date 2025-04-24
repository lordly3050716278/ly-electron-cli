const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')

const distPath = path.join(__dirname, 'dist')
const distElectronPath = path.join(__dirname, 'dist-electron')
const pkgPath = path.resolve(__dirname, 'package.json')
const builderPath = path.resolve(__dirname, 'electron-builder.json5')

const main = async () => {
    try {
        // 删除打包产物
        await fs.promises.rm(distPath, { recursive: true, force: true })
        console.log(`✅ 已将 "dist" 目录清除`)

        await fs.promises.rm(distElectronPath, { recursive: true, force: true })
        console.log(`✅ 已将 "dist-electron" 目录清除`)

        // 读取并解析 JSON 文件
        const pkgData = await fs.promises.readFile(pkgPath, 'utf-8')
        const builderData = await fs.promises.readFile(builderPath, 'utf-8')

        // 解析 JSON 和 JSON5 数据
        const pkg = JSON.parse(pkgData)
        const builderConfig = JSON5.parse(builderData) // 使用 JSON5 解析 .json5 文件

        // 同步 productName
        builderConfig.productName = pkg.buildName || 'MyApp'

        // 写入修改后的配置
        await fs.promises.writeFile(builderPath, JSON5.stringify(builderConfig, null, 2)) // 使用 JSON5 来写入

        console.log(`✅ 已将 productName 同步为 "${builderConfig.productName}"`)
    } catch (error) {
        console.error('发生错误:', error)
    }
}

main()