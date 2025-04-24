#!/usr/bin/env node
import { fileURLToPath } from 'url'
import path from 'path'

import { program } from 'commander'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import chalk from 'chalk'
import { execSync } from 'child_process'
import { createPackageJson } from './package.json.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkg = fs.readJsonSync(path.resolve(__dirname, '../package.json'))

// 指定版本和描述信息
program
    .version(pkg.version)
    .description('用于创建 Vite + Vue + Electron 快速启动项目')

// 初始化一个 Vite + Vue + Electron 快速启动项目
program.command('init')
    .description("初始化一个 Vite + Vue + Electron 快速启动项目")
    .action(async () => {
        // 交互式提问
        const { projectName, productName, buildName, installDeps } = await inquirer.prompt([
            { type: 'input', name: 'projectName', message: '项目名称：' },
            { type: 'input', name: 'productName', message: '应用名称：' },
            { type: 'input', name: 'buildName', message: '打包产物名称：' },
            { type: 'confirm', name: 'installDeps', message: '是否安装依赖？', default: true }
        ])

        if (!projectName) {
            console.log(chalk.red('❌ 项目名称不能为空！'))
            return
        }

        // 项目路径
        const projectPath = path.join(process.cwd(), projectName)

        // 目录存在
        if (fs.existsSync(projectPath)) {
            const { ifReplaceDir } = await inquirer.prompt([
                { type: 'confirm', name: 'ifReplaceDir', message: '目录已存在，是否覆盖创建？', default: true }
            ])

            if (!ifReplaceDir) {
                console.log(chalk.red('❌ 目录已存在无法创建'))
                return
            }

            await fs.promises.rm(projectPath, { recursive: true, force: true })
            console.log(chalk.green(`✅ 已将目录删除！`))
        }

        // 创建项目目录
        console.log(chalk.green(`🚀 正在创建项目：${projectName}...`))
        fs.mkdirSync(projectPath)

        // 创建项目文件
        fs.copySync(path.join(__dirname, 'templates'), path.join(projectPath))

        fs.writeFileSync(path.join(projectPath, 'package.json'), createPackageJson(projectName, productName, buildName))

        // 如果用户选择安装依赖
        if (installDeps) {
            console.log(chalk.blue(`🔧 安装依赖：`))
            try {
                execSync('npm install', { stdio: 'inherit', cwd: projectPath })
                console.log(chalk.green(`✅ 依赖安装成功！`))
            } catch (error) {
                console.log(chalk.red(`❌ 依赖安装失败: ${error.message}`))
            }
        }

        // 提示成功
        console.log(chalk.green('✅ 项目创建成功！'))

        // 提示用户下一步操作
        console.log(chalk.blue(`💻 进入项目目录：`))
        console.log(chalk.cyan(`cd ${projectName}`)) // 提示用户进入项目目录

        if (!installDeps) {
            console.log(chalk.blue(`🔧 安装依赖：`))
            console.log(chalk.cyan(`npm install`)) // 提示用户运行 `npm install`
        }

        console.log(chalk.blue(`🚀 启动开发环境：`))
        console.log(chalk.cyan(`npm run dev`)) // 提示用户启动开发环境

        console.log(chalk.blue(`⚙️ 打包项目：`))
        console.log(chalk.cyan(`npm run build`)) // 提示用户运行 `npm run build`
    })

program.parse(process.argv)