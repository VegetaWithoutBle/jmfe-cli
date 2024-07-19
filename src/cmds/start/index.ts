import { devConfigurationMaker } from '../../config/webpack/dev'
import { getClientEnvironment, initEnvironment } from '../../env'
import { StartCmdConfig } from './type'
import { choosePort, prepareUrls } from './utils'
export const start = async (params: StartCmdConfig) => {
  const mode = 'development'
  process.env.NODE_ENV = mode
  initEnvironment()
  const environment = getClientEnvironment()
  console.log(environment, 'environment')

  const port = await choosePort(parseInt(process.env.PORT as string, 10) || 8080)
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const host = '0.0.0.0'
  const urls = prepareUrls(protocol, host, port)
  process.env.PORT = port.toString()
  process.env.ADDRESS = urls.lanUrlForConfig || 'localhost'
  process.env.PROTOCOL = protocol

  const devConfiguration = devConfigurationMaker({})
  console.log(devConfiguration, 'dev')
}
