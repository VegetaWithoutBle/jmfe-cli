import path from 'path'
import { isUseYarn } from '.'
import store, { CliPkg, StoreKey, StoreValue } from '../store'

/**
 * 初始化store的默认数据
 */
export const initStoreValue = () => {
  const cmdDir = path.resolve(__dirname, '../')
  const pkgJson: CliPkg = require(path.join(__dirname, '../../package.json'))
  updateStoreData('cliPath', cmdDir)
  updateStoreData('cliPackageJson', pkgJson)
  updateStoreData('isUseYarn', isUseYarn())
}
/**
 * 更新store全局变量
 * @param key StoreKey
 * @param value StoreValue
 */
export const updateStoreData = (key: StoreKey, value: StoreValue) => {
  //@ts-ignore
  store[key] = value
}
