import { Configuration } from 'webpack'
import { WebpackConfigurer } from './type'

export const BASE_WEBPACK_CONFIG: Configuration = {}

const webpackConfig: Configuration = {}

const configure: WebpackConfigurer = params => {
  const {} = params
  return webpackConfig
}

export default configure
