import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import validateNpmName from 'validate-npm-package-name'
import store from '../../store'
import { message } from '../../utils/log'
import { CloneTemplateConfig, CreateCmdConfig, CreateProjectConfig } from './type'

const currentPath = process.cwd()

export const create = async (params: CreateCmdConfig) => {
  const { projectName, remoteTemplateUrl } = params
  const projectPath = path.join(currentPath, projectName)
  const templatePath = path.join(store.cliPath, 'template')
  // 创建项目文件夹
  createProjectDir({ projectName: projectName, projectPath: projectPath })
  // 进入项目文件夹内工作目录
  process.chdir(projectPath)
  // 初始化git
  gitInit()
  // 克隆模板生成项目文件
  await cloneTemplate({
    localTemplatePath: templatePath,
    projectPath: projectPath,
    remoteTemplateUrl: remoteTemplateUrl,
  })
  // 运行插件
  await initPlugins()
  // 创建结束
  welcome(projectName)
}

const initPlugins = async () => {}

const createProjectDir = (params: CreateProjectConfig) => {
  const { projectName, projectPath } = params
  // 校验项目名合法
  validateProjectName(projectName)
  // 校验项目文件夹是否存在
  validateProjectExisted(projectPath, projectName)
  // 创建文件夹
  fs.ensureDirSync(projectPath)
}

const cloneTemplate = async (params: CloneTemplateConfig) => {
  const { localTemplatePath, projectPath, remoteTemplateUrl } = params
  if (remoteTemplateUrl) message.warn('Unsupported remote template, using local template ')
  return await new Promise<void>(resolve => {
    fs.copy(localTemplatePath, projectPath, (err: NodeJS.ErrnoException | null | undefined) => {
      if (err) {
        message.error(`Clone local template failed：${err.message}`)
        process.exit(1)
      } else {
        resolve()
        message.success('Clone template success!')
      }
    })
  })
}

const validateProjectExisted = (projectPath: string, projectName: string) => {
  const isExist = fs.existsSync(projectPath)
  if (isExist) {
    message.error(`Could not create a project called ${projectName}, directory existed.`)
    process.exit(1)
  }
}

const validateProjectName = (projectName: string) => {
  const res = validateNpmName(projectName)
  if (!res.validForNewPackages) {
    message.error(`Could not create a project called ${chalk.red(projectName)} because of npm naming restrictions:`)
    printValidationResults(res.errors)
    printValidationResults(res.warnings)
    process.exit(1)
  }
}

const printValidationResults = (results?: string[]) => {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`))
    })
  }
}

const gitInit = () => {
  try {
    execSync('git init', { stdio: 'ignore' })
  } catch (error) {
    message.error('git init failed', error?.message)
  }
}

const welcome = (projectName: string) => {
  const cmd = store.isUseYarn ? 'yarn' : 'npm'
  console.log(`
✨ Success! Created ${chalk.blue(projectName)}
Inside that directory, you can run several commands:\n
  ${chalk.green(`${cmd} start`)}  ${chalk.gray(`# Starts the development server.`)}
  ${chalk.green(`${cmd} build`)}  ${chalk.gray(`# Bundles the app into static files for production.`)}
  ${chalk.green(`${cmd} serve`)}  ${chalk.gray(`# Serve production bundle in 'dist'`)}
  ${chalk.green(`${cmd} analyze`)}  ${chalk.gray(`# Analyze webpack bundle for production`)}\n
Typing ${chalk.green(`cd ${projectName}`)} to start code happily.
  `)
}
