import { execSync } from 'child_process'
import fs from 'fs-extra'
import os from 'os'

/**
 * is user environment using yarn
 */
export const isUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * writeJSON
 * @param path path of be write json file
 * @param data write json data
 */
export const writeJSON = (path: string, data: object) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + os.EOL)
}

/**
 * transformDependencies
 */
export const transformDependencies = (org: { [key: string]: string }): string[] => {
  return Object.keys(org).map(key => {
    if (org[key] === '*') {
      return key
    }
    return `${key}@${org[key]}`
  })
}

/**
 * get app name
 * TODO: maybe trans to get app info
 */
export const appName = (): string => {
  return ''
}
