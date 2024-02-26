export type StoreKey = keyof Store
export type StoreValue = any

export interface CliPkg {
  [key: string]: unknown
}
export class Store {
  private static instance: Store

  public constructor() {
    if (Store.instance != null) {
      throw new Error('Store only can createOnce')
    }
  }
  /**
   * cli所在的根目录
   */
  public cliPath: string = ''
  /**
   * cli的packageJson数据
   */
  public cliPackageJson: CliPkg = {}
}

const store = new Store()
export default store
