import store from '../../store'
import { StartCmdConfig } from './type'
export const start = async (params: StartCmdConfig) => {
  console.log(params)
  console.log(store, 'sss')
}
