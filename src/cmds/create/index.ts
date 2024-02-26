import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import store from '../../store'
import { message } from '../../utils/log'
import { CreateCmdConfig } from './type'

const currentPath = process.cwd()
export const create = async (params: CreateCmdConfig) => {
  const projectName = params.projectName
  message.info(`将在 ${currentPath} 目录下创建 ${chalk.green(projectName)}`)
  const remoteUrl = params.remoteUrl
  if (remoteUrl) {
    message.warn('暂不支持模板地址，将创建默认模板')
  }
  const projectPath = path.join(currentPath, projectName)
  const templatePath = path.join(store.cliPath, '../template')
  // 创建项目文件夹
  createProject(projectPath)
  // 进入项目文件夹内工作目录
  process.chdir(projectPath)
  // 生成项目文件
  await cloneTemplate(templatePath, projectPath)
}

export const createProject = (projectPath: string) => {
  const isExist = fs.existsSync(projectPath)
  if (isExist) {
    const name = path.basename(projectPath)
    message.error(`无法创建项目${name}, 文件夹已存在`)
    process.exit(1)
  }
  // 创建文件夹
  fs.ensureDirSync(projectPath)
  message.success(`已在 ${currentPath} 目录下创建项目`)
}

export const cloneTemplate = async (fromPath: string, toPath: string) => {
  return await new Promise<void>((resolve, reject) => {
    fs.copy(fromPath, toPath, (err: NodeJS.ErrnoException | null | undefined) => {
      if (err) {
        message.error(`无法创建项目,错误信息：${err.message}`)
        process.exit(1)
      } else {
        resolve()
      }
    })
  })
}
