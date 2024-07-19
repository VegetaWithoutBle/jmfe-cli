import { Options } from 'html-webpack-plugin'

export interface TemplatePluginParams {
  page: string
}

const DEFAULT_CONFIG: Options = {
  title: '',
  filename: `.html`,
  chunks: [],
  chunksSortMode: 'auto',
  inject: true,
  minify: undefined,
}
export const getCommonTemplatePluginOptions = (params: TemplatePluginParams) => {
  const { page } = params
  return {
    ...DEFAULT_CONFIG,
    title: page,
    filename: `${page}.html`,
    chunks: [page],
  }
}
