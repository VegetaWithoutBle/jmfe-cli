import { Configuration } from 'webpack'
import { BaseConfigurationParams } from './type'

const getBaseConfiguration = (params: BaseConfigurationParams): Configuration => {
  return baseConfiguration
}
const baseConfiguration: Configuration = {}

export { baseConfiguration, getBaseConfiguration }
