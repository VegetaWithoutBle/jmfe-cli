import { execSync } from 'child_process'
import fs from 'fs-extra'
import os from 'os'

export const isUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export function writeJSON(path: string, data: object) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + os.EOL)
}
export function transformDependencies(org: { [key: string]: string }): string[] {
  return Object.keys(org).map(key => {
    if (org[key] === '*') {
      return key
    }
    return `${key}@${org[key]}`
  })
}
