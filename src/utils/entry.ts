import { glob } from 'glob'
import path from 'path'
import { EXTENSIONS, TEMPLATE_EXTENSIONS } from '../constants'
import paths from '../paths'

export interface PageOption {
  context: string
  entry?: string[]
  isProduction?: boolean
  inject: { [key: string]: string }
  templateParameters: { [key: string]: string }
  hotreload: boolean
}

/**
 * 传统的入口方式, 一个page.{ext} 对应 一个page.js
 */
export const getTraditionalEntries = (entry?: string[]) => {
  const globStr = path.join(paths.appSrc, `*.@(${TEMPLATE_EXTENSIONS.map(i => i.slice(1)).join('|')})`)
  const reg = /^.*\/(.*)\.([a-zA-Z]*)$/
  const matchPages = glob.sync(globStr, {})
  const pages = matchPages.reduce<{ [page: string]: string }>((entries, page) => {
    const matched = page.match(reg)
    if (matched) {
      const [, name, ext] = matched
      if (entry == null || entry.indexOf(name) !== -1) {
        entries[name] = ext
      }
    }
    return entries
  }, {})

  return pages
}
const PageLessFileRegexp = /.*\/(.*)\.page\..*$/
export const getPagelessEntries = (entry?: string[]) => {
  return glob
    .sync(path.join(paths.appSrc, `*.page.@(${EXTENSIONS.map(i => i.slice(1)).join('|')})`))
    .map(p => {
      const match = p.match(PageLessFileRegexp)
      return match![1]
    })
    .filter(p => (entry ? entry.indexOf(p) !== -1 : true))
}
