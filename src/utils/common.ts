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
 * interpolate ${variable} in string
 */
export const interpolate = (str: string, local: { [key: string]: string }) => {
  if (str == null) {
    return ''
  }
  const matches = str.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || []
  matches.forEach(function (match) {
    const key = match.replace(/\$|{|}/g, '')
    let variable = local[key] || ''
    // Resolve recursive interpolations
    variable = interpolate(variable, local)
    str = str.replace(match, variable)
  })
  return str
}
