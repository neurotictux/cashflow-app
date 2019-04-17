import User from '../models/user'

export default {
  up: (queryInterface) => queryInterface.createTable(User.TABLE_NAME, User.Model, User.Attributes),
  down: (queryInterface) => queryInterface.dropTable(User.TABLE_NAME)
}