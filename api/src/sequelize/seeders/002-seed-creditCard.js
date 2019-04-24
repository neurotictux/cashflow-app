export default {
  up: (queryInterface) => queryInterface.bulkInsert('CreditCard', [{
    name: 'cartao_mock_1',
    userId: 1
  }, {
    name: 'cartao_mock_2',
    userId: 1
  }, {
    name: 'cartao_mock_3',
    userId: 2
  }, {
    name: 'cartao_mock_4',
    userId: 2
  }])
}