import { CreditCardModel } from '../db'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('CreditCard', CreditCardModel, {
      freezeTableName: 'CreditCard',
      undercored: false,
      updatedAt: false,
      createdAt: false
    })
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('CreditCard')
  }
}