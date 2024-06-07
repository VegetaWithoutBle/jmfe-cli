import { Configuration } from 'webpack'
import { ProdConfigurationParams } from './type'

const getProdConfiguration = (params: ProdConfigurationParams): Configuration => {
  return prodConfiguration
}
const prodConfiguration: Configuration = {
  name: '',
}

export { getProdConfiguration, prodConfiguration }
