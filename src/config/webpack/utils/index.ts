import paths from '../../../paths'

export const getDevEntries = () => {
  const context = paths.appSrc
  const entries: { [name: string]: string[] } = {}
  console.log(context, 'context')
  console.log(entries, 'entries')
  return {}
}
