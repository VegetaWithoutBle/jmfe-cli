const fs = require('fs').promises
const path = require('path')

async function copy(from, to) {
  const fromPath = path.resolve(from)
  console.log(fromPath, 'fromPath')
  const toPath = path.resolve(to)

  console.log(toPath, 'toPath')
  try {
    await fs.access(toPath)
  } catch (err) {
    console.error(err)
    try {
      await fs.mkdir(toPath, { recursive: true })
    } catch (err) {
      console.error(err)
      return
    }
  }
  try {
    const paths = await fs.readdir(fromPath)
    for (const item of paths) {
      const newFromPath = path.join(fromPath, item)
      const newToPath = path.join(toPath, item)
      const stat = await fs.stat(newFromPath)
      if (stat.isFile()) {
        await copyFile(newFromPath, newToPath)
        console.log(newToPath)
      }
      if (stat.isDirectory()) {
        await copy(newFromPath, newToPath)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function copyFile(from, to) {
  try {
    await fs.copyFile(from, to)
  } catch (err) {
    console.error(err)
  }
}

copy('./dist', '../../clitest/test-one/node_modules/@erendingfe/jmfe-cli/dist')
  .then(() => console.log('Copy completed'))
  .catch(err => console.error('Copy failed:', err))
