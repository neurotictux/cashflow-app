const rimraf = require('rimraf')
rimraf('finance.test.db', err => { if (err) throw err })