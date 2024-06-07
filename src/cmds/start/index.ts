import { devConfiguration } from '../../config/webpack/dev'
import { StartCmdConfig } from './type'
import { choosePort, prepareUrls } from './utils'
export const start = async (params: StartCmdConfig) => {
  const port = await choosePort(parseInt(process.env.PORT as string, 10) || 8080)
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const host = '0.0.0.0'
  const urls = prepareUrls(protocol, host, port)
  process.env.PORT = port.toString()
  process.env.ADDRESS = urls.lanUrlForConfig || 'localhost'
  process.env.PROTOCOL = protocol
  console.log(devConfiguration)
}
