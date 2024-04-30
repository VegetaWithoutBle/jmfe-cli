#!/usr/bin/env node

import { program } from 'commander'
import { analyze } from './cmds/analyze'
import { build } from './cmds/build'
import { create } from './cmds/create'
import { serve } from './cmds/serve'
import { start } from './cmds/start'
import store from './store'
import { initStoreValue } from './utils/store'

initStoreValue()
program.version(`当前版本: ${store.cliPackageJson.version}`, '-v, --version', 'get current version')
program
  .command('create <projectName>')
  .description('Create a react project')
  .option('-r, --remote <remote>', 'user url to download the remote template')
  .option('-l, --local <local>', 'use default | v18 | v16, if un set local type, use default type')
  .action((projectName, option) => {
    create({ appName: projectName, remoteTemplateUrl: option.remote, localTemplateType: option.local })
  })
program
  .command('start')
  .option('-p, --port <port>', 'set start port')
  .description('start a program')
  .action(option => {
    start({ port: option.port })
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
