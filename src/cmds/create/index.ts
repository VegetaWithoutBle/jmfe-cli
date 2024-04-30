import chalk from 'chalk'
import { execSync } from 'child_process'
import fs, { writeJSON } from 'fs-extra'
import pickBy from 'lodash/pickBy'
import path from 'path'
import semver from 'semver'
import validateNpmName from 'validate-npm-package-name'
import store from '../../store'
import { transformDependencies } from '../../utils/common'
import { message } from '../../utils/log'
import { CloneTemplateConfig, CreateCmdConfig, CreateProjectConfig } from './type'

const currentPath = process.cwd()
const buildingDevDependencies = [
  // format
  'prettier',
  'pretty-quick',
  'husky',
  '@types/webpack-env',
  '@types/react-hot-loader',
]

export const create = async (params: CreateCmdConfig) => {
  const { appName, remoteTemplateUrl, localTemplateType = 'v18' } = params
  const appPath = path.join(currentPath, appName)
  const templatePath = path.join(store.cliPath, `template/${localTemplateType}`)
  // create app file
  createAppDir({ appName: appName, appPath: appPath })
  process.chdir(appPath)
  // init git
  gitInit()
  // clone app template
  await cloneTemplate({
    localTemplatePath: templatePath,
    appPath: appPath,
    remoteTemplateUrl: remoteTemplateUrl,
  })
  await initialPackageJson({
    appName: appName,
    appPath: appPath,
    templatePath: templatePath,
  })
  // inject plugins
  await initPlugins()
  // create end.
  welcome(appName)
}

const initPlugins = async () => {}

/**
 * initial package.json data by template
 */
const initialPackageJson = async (params: { appName: string; appPath: string; templatePath: string }) => {
  const { appName, appPath, templatePath } = params
  const ownPackageJson = store.cliPackageJson
  const binName = Object.keys(ownPackageJson.bin as object)[0]
  const reservedProperties = {
    name: appName,
    version: '0.1.0',
    private: true,
    dependencies: {},
    devDependencies: {},
    scripts: {
      start: `${binName} start`,
      build: `${binName} build`,
      serve: `${binName} serve`,
      analyze: `${binName} analyze`,
    },
    // prettier format
    husky: {
      hooks: {
        'pre-commit': 'pretty-quick --staged',
      },
    },
  }
  const optionalProperties = {
    jm: {
      // unPack dependencies, usually use cdn scripts
      externals: {},
      // proxy config, can use template variable in .env.*
      proxy: {},
      // for antd, antd-mobile
      importPlugin: [],
    },
    browserslist: 'last 2 versions',
    optionalDependencies: {},
  }
  let packageJson: { [key: string]: any } = {
    ...reservedProperties,
    ...optionalProperties,
  }

  if (fs.existsSync(templatePath)) {
    const templatePackageJson = require(path.join(templatePath, 'package.json'))

    if (templatePackageJson.dependencies) {
      packageJson.dependencies = { ...packageJson.dependencies, ...templatePackageJson.dependencies }
    }

    if (templatePackageJson.devDependencies) {
      packageJson.devDependencies = { ...packageJson.devDependencies, ...templatePackageJson.devDependencies }
    }

    if (templatePackageJson.scripts) {
      packageJson.scripts = { ...packageJson.scripts, ...templatePackageJson.scripts }
    }

    // merge package.json
    const includeFields: string[] = templatePackageJson.includeFields || []
    const pickedPkg = pickBy(
      templatePackageJson,
      (value, key) => key in optionalProperties || key.startsWith('jm') || includeFields.indexOf(key) !== -1,
    )

    packageJson = {
      ...packageJson,
      ...pickedPkg,
    }

    await writeJSON(path.join(appPath, 'package.json'), packageJson)
    message.info(`Installing pacakges. This might take a couple of minutes.`)

    const devDependencies = buildingDevDependencies
      .filter(dep => {
        return !(dep in packageJson.dependencies) && !(dep in packageJson.devDependencies)
      })
      .concat(transformDependencies(packageJson.devDependencies))
    const dependencies = transformDependencies(packageJson.dependencies)
    let packageToInstall = ownPackageJson.name as string
    let cliVersion = packageJson.devDependencies[packageToInstall]
    delete packageJson.devDependencies[packageToInstall]
    if (cliVersion) {
      const validSemver = semver.valid(cliVersion)
      if (validSemver) {
        packageToInstall += `@${validSemver}`
      }
    }
    devDependencies.push(packageToInstall)

    let dependenciesInstallCommand: string
    let devDependenciesInstallCommand: string
    if (store.isUseYarn) {
      const command = 'yarnpkg'
      dependenciesInstallCommand = `${command} add ${dependencies.join(' ')} -s`
      devDependenciesInstallCommand = `${command} add ${devDependencies.join(' ')} --dev -s`
    } else {
      const command = 'npm'
      dependenciesInstallCommand = `${command} install ${dependencies.join(' ')} --save`
      devDependenciesInstallCommand = `${command} install ${devDependencies.join(' ')} --save-dev`
    }

    message.info(chalk.cyan(`Installing dependencies...`))
    execSync(dependenciesInstallCommand, { stdio: 'inherit' })
    message.info(chalk.cyan(`Installing devdependencies...`))
    execSync(devDependenciesInstallCommand, { stdio: 'inherit' })
  }
}

const createAppDir = (params: CreateProjectConfig) => {
  const { appName, appPath } = params
  // validate app name
  validateAppName(appName)
  // validate app existed
  validateAppExisted(appPath, appName)
  // create file
  fs.ensureDirSync(appPath)
}

const cloneTemplate = async (params: CloneTemplateConfig) => {
  const { localTemplatePath, appPath, remoteTemplateUrl } = params
  if (remoteTemplateUrl) message.warn('Unsupported remote template, using local template ')
  return await new Promise<void>(resolve => {
    fs.copy(localTemplatePath, appPath, (err: NodeJS.ErrnoException | null | undefined) => {
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

const validateAppExisted = (appPath: string, appName: string) => {
  const isExist = fs.existsSync(appPath)
  if (isExist) {
    message.error(`Could not create a app called ${appName}, directory existed.`)
    process.exit(1)
  }
}

const validateAppName = (appName: string) => {
  const res = validateNpmName(appName)
  if (!res.validForNewPackages) {
    message.error(`Could not create a app called ${chalk.red(appName)} because of npm naming restrictions:`)
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

const welcome = (appName: string) => {
  const cmd = store.isUseYarn ? 'yarn' : 'npm'
  console.log(`
✨ Success! Created ${chalk.blue(appName)}
Inside that directory, you can run several commands:\n
  ${chalk.green(`${cmd} start`)}  ${chalk.gray(`# Starts the development server.`)}
  ${chalk.green(`${cmd} build`)}  ${chalk.gray(`# Bundles the app into static files for production.`)}
  ${chalk.green(`${cmd} serve`)}  ${chalk.gray(`# Serve production bundle in 'dist'`)}
  ${chalk.green(`${cmd} analyze`)}  ${chalk.gray(`# Analyze webpack bundle for production`)}\n
Typing ${chalk.green(`cd ${appName}`)} to start code happily.
  `)
}
