import { Configuration } from 'webpack'

export interface StartCmdConfig {}

export interface CreateCompilerParams {
  config: Configuration
  onCompileSuccess?: () => void
}
