import webpack, { Compiler } from 'webpack'
import { CreateCompilerParams } from '../type'

const createCompiler = (params: CreateCompilerParams): Compiler => {
  const { config, onCompileSuccess } = params
  let compiler = webpack(config)

  compiler.hooks.invalid.tap('done', stats => {
    onCompileSuccess?.()
  })
  return compiler
}

export { createCompiler }
