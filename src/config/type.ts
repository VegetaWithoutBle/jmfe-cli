import { Configuration } from 'webpack'
import { WebpackPaths } from '../paths'

export interface WebpackConfigurerParams {
  paths: WebpackPaths
}
export type WebpackConfigurer = (params: WebpackConfigurerParams) => Configuration
