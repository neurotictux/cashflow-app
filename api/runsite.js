const { spawn } = require('child_process')
try {
  spawn('npm', ['run', 'dev'], {
    cwd: '../site'
  })
} catch (ex) {
  console.log(ex)
}