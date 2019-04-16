const rimraf = require('rimraf')
rimraf('finance.test.sqlite', err => { if (err) throw err })