const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')

const pkgPath = path.resolve(__dirname, 'package.json')
const builderPath = path.resolve(__dirname, 'electron-builder.json5')

async function syncProductName() {
    // 读取并解析 JSON 文件
    const pkgData = await fs.promises.readFile(pkgPath, 'utf-8')
    const builderData = await fs.promises.readFile(builderPath, 'utf-8')

    // 解析 JSON 和 JSON5 数据
    const pkg = JSON.parse(pkgData)
    const builderConfig = JSON5.parse(builderData) // 使用 JSON5 解析 .json5 文件

    // 同步 productName
    builderConfig.productName = pkg.productName || 'MyApp'

    // 写入修改后的配置
    await fs.promises.writeFile(builderPath, JSON5.stringify(builderConfig, null, 2)) // 使用 JSON5 来写入

    console.log(`✅ 已将 productName 同步为 "${builderConfig.productName}"`)
}

// 调用同步函数
syncProductName().catch((err) => console.error('发生错误:', err))