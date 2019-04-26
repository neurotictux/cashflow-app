import Installment from '../models/installment'

export default {
  up: (queryInterface) => queryInterface.createTable(Installment.TABLE_NAME, Installment.Model, Installment.Attributes),
  down: (queryInterface) => queryInterface.dropTable(Installment.TABLE_NAME)
}