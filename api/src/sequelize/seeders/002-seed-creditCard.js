export default {
  up: (queryInterface) => queryInterface.bulkInsert('CreditCard', [{
    description: 'cartao_mock_1',
    userId: 1
  }, {
    description: 'cartao_mock_2',
    userId: 1
  }, {
    description: 'cartao_mock_3',
    userId: 2
  }, {
    description: 'cartao_mock_4',
    userId: 2
  }])
}