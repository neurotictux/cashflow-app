import CreditCard from '../models/creditCard'

export default {
  up: (queryInterface) => queryInterface.createTable(CreditCard.TABLE_NAME, CreditCard.Model, CreditCard.Attributes),
  down: (queryInterface) => queryInterface.dropTable(CreditCard.TABLE_NAME)
}