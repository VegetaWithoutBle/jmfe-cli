import { StartCmdConfig } from './type'
export const start = async (params: StartCmdConfig) => {
  const { port, entry } = params
  console.log(port, 'port')
  console.log(entry, 'entry')
  console.log(process.env, 'process.env')
}
