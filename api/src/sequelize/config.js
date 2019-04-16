// require('babel-core/register')

try {
  const dotenv = require('dotenv')
  dotenv.config()
} catch { }

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SECRET: process.env.SECRET,
  dev: {
    DATABASE_URI: process.env.DATABASE_URL,
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: true },
    dialect: 'postgres',
    operatorsAliases: false,
    logging: true
  },
  test: {
    dialect: 'sqlite',
    storage: './finance.test.sqlite',
    operatorsAliases: false,
    logging: false
  },
  prod: {
    DATABASE_URI: process.env.DATABASE_URL,
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: true },
    dialect: 'postgres',
    operatorsAliases: false,
    logging: true
  }
}