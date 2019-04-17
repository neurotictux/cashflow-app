import Payment from '../models/payment'

export default {
  up: (queryInterface) => queryInterface.createTable(Payment.TABLE_NAME, Payment.Model, Payment.Attributes),
  down: (queryInterface) => queryInterface.dropTable(Payment.TABLE_NAME)
}