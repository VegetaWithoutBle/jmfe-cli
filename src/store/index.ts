class Store {
  private static instance: Store

  public constructor() {
    console.log('global init')

    if (Store.instance != null) {
      throw new Error('Store only can createOnce')
    }
  }

  public rootCwd: string = ''
}

const store = new Store()
export default store
