import { Configuration } from 'webpack'
import paths from '../../paths'
import { DevConfigurationParams } from './type'
import { getDevEntries } from './utils'

const getDevConfiguration = (params: DevConfigurationParams): Configuration => {
  return devConfiguration
}
const devConfiguration: Configuration = {
  name: '',
  bail: false,
  context: paths.appSrc,
  mode: 'development',
  // TODO:
  devtool: undefined,
  entry: getDevEntries(),
  target: 'web',
}

export { devConfiguration, getDevConfiguration }
