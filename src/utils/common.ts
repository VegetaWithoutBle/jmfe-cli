import { execSync } from 'child_process'

export const isUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
