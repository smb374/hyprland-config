const entry = App.configDir + '/src/main.ts'
const outdir = '/tmp/ags/js'

try {
  await Utils.execAsync([
    'bun', 'build', entry,
    '--outdir', outdir,
    '--external', 'resource://*',
    '--external', 'gi://*',
  ])
} catch (error) {
  console.error(error)
}

const main = await import(`file://${outdir}/main.js`)

App.config(main.default)

export { }
