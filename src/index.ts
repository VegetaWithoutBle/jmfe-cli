#!/usr/bin/env node

import { program } from 'commander'
import { analyze } from './cmds/analyze'
import { build } from './cmds/build'
import { create } from './cmds/create'
import { CreateCmdConfig } from './cmds/create/type'
import { serve } from './cmds/serve'
import { start } from './cmds/start'
import { StartCmdConfig } from './cmds/start/type'
import store from './store'
import { initStoreValue } from './utils'

initStoreValue()
program.version(`当前版本: ${store.cliPackageJson.version}`, '-v, --version', 'get current version')
program
  .command('create <projectName>')
  .description('Create a react project')
  .option('-r, --remote <remote>', '远程模板地址')
  .action((projectName, option) => {
    let createParams: CreateCmdConfig = {
      projectName: projectName,
      remoteUrl: option.remote,
    }
    create(createParams)
  })
program
  .command('start')
  .option('-p, --port <port>', '设置端口')
  .description('start a program')
  .action(option => {
    let startParams: StartCmdConfig = {
      port: option.port,
    }
    start(startParams)
  })
program
  .command('build')
  .description('build program')
  .action(() => {
    build({})
  })
program
  .command('analyze')
  .description('analyze program')
  .action(() => {
    analyze()
  })
program
  .command('serve')
  .description('serve')
  .action(() => {
    serve()
  })
program.parse(process.argv)
