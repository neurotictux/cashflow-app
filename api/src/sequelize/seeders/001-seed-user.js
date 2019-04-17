export default {
  up: (queryInterface) => queryInterface.bulkInsert('User', [{
    name: 'user_mock_1',
    email: 'user_mock_1@mail.com',
    password: '123456',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastAccess: new Date()
  }, {
    name: 'user_mock_2',
    email: 'user_mock_2@mail.com',
    password: '123456',
    createdAt: new Date()
  }])
}