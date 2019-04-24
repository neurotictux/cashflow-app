require('@babel/register')

try {
  const dotenv = require('dotenv')
  dotenv.config()
} catch { }

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'test',
  SECRET: process.env.SECRET,
  dev: {
    DATABASE_URI: process.env.DATABASE_URL,
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: true },
    dialect: 'postgres',
    logging: true
  },
  test: {
    dialect: 'sqlite',
    storage: './finance.test.sqlite',
    logging: false
  },
  prod: {
    DATABASE_URI: process.env.DATABASE_URL,
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: true },
    dialect: 'postgres',
    logging: true
  }
}