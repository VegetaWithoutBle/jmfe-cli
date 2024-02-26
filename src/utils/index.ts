import path from 'path'
import { CliPkg } from '../store'
import { updateStoreData } from './store'

/**
 * 初始化store的默认数据
 */
export const initStoreValue = () => {
  const cmdDir = path.resolve(__dirname, '../')
  const pkgJson: CliPkg = require(path.join(__dirname, '../../package.json'))
  updateStoreData('cliPath', cmdDir)
  updateStoreData('cliPackageJson', pkgJson)
}
