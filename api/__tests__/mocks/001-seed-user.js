import sha1 from 'sha1'
export default {
  up: (queryInterface) => queryInterface.bulkInsert('User', [{
    name: 'user_mock_1',
    email: 'user_mock_1@mail.com',
    password: sha1('123456'),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastAccess: new Date()
  }, {
    name: 'user_mock_2',
    email: 'user_mock_2@mail.com',
    password: sha1('123456'),
    createdAt: new Date()
  }, {
    name: 'user_mock_alterado',
    email: 'user_mock_alterado@mail.com',
    password: sha1('123456'),
    createdAt: new Date()
  }, {
    name: 'estimate',
    email: 'estimate@mail.com',
    password: sha1('123456'),
    createdAt: new Date()
  }])
}