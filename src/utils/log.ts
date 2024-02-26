import chalk from 'chalk'

const logSymbols = {
  success: chalk.bgGreen(chalk.white(' DONE ')),
  error: chalk.bgRed(chalk.white(' FAIL ')),
  warn: chalk.bgYellow(chalk.white(' WARN ')),
  info: chalk.bgBlue(chalk.white(' INFO ')),
}

const joinSuffix = (suffix?: string) => {
  return suffix ? ` ==> ${suffix}` : ''
}

export const message = {
  log: (text: any, suffix?: string) => {
    console.log(text, joinSuffix(suffix))
  },
  success: (text?: string, suffix?: string) => {
    console.log(logSymbols.success + ' ' + text + joinSuffix(suffix))
  },
  error: (text?: string, suffix?: string) => {
    console.log(logSymbols.error + ' ' + text + joinSuffix(suffix))
  },
  warn: (text?: string, suffix?: string) => {
    console.log(logSymbols.warn + ' ' + text + joinSuffix(suffix))
  },
  info: (text?: string, suffix?: string) => {
    console.log(logSymbols.info + ' ' + text + joinSuffix(suffix))
  },
}
