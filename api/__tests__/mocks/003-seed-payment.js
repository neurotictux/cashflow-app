export default {
  up: (queryInterface) => queryInterface.bulkInsert('Payment', [{
    // 1
    description: 'Payment 1',
    userId: 1,
    Type: 1,
    creditCardId: 2
  }, {
    // 2
    description: 'Payment 2',
    userId: 1,
    Type: 2,
    creditCardId: 1
  }, {
    // 3
    description: 'Payment 3',
    userId: 2,
    Type: 1,
    creditCardId: 3
  }, {
    // 4
    description: 'Payment 4',
    userId: 2,
    Type: 2,
    creditCardId: 3
  }, {
    // 5
    description: 'Salário',
    userId: 4,
    Type: 1,
    creditCardId: 5,
    fixedPayment: true
  }, {
    // 6
    description: 'Internet',
    userId: 4,
    Type: 2,
    creditCardId: 5,
    fixedPayment: true
  }, {
    // 7
    description: 'Computador',
    userId: 4,
    Type: 2,
    creditCardId: 3
  }, {
    // 8
    description: 'Televisão',
    userId: 4,
    Type: 2,
    creditCardId: 3
  }, {
    // 9
    description: 'Balcão',
    userId: 4,
    Type: 2,
    creditCardId: 3
  }])
}