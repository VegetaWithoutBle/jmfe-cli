import path from "path"
import { CreateCmdConfig } from "./type"

export const create = (params: CreateCmdConfig) => {
  const cwd = process.cwd()
  const cmdDir = path.resolve(__dirname, "../")
  console.log(cwd, "cwd")
  console.log(cmdDir, "cmdDir")

  console.log(params.projectName, "项目名称")
}
