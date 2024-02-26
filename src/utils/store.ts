import store, { StoreKey, StoreValue } from '../store'

/**
 * 更新store全局变量
 * @param key StoreKey
 * @param value StoreValue
 */
export const updateStoreData = (key: StoreKey, value: StoreValue) => {
  store[key] = value
}
