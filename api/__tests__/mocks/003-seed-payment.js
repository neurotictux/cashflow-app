export default {
  up: (queryInterface) => queryInterface.bulkInsert('Payment', [{
    description: 'Payment 1',
    userId: 1,
    Type: 1,
    firstPaymentDate: new Date(),
    creditCardId: 2,
    fixedPayment: false
  }, {
    description: 'Payment 2',
    userId: 1,
    Type: 2,
    firstPaymentDate: new Date(),
    creditCardId: 1,
    fixedPayment: false,
  }, {
    description: 'Payment 3',
    userId: 2,
    Type: 1,
    firstPaymentDate: new Date(),
    creditCardId: 3,
    fixedPayment: false
  }, {
    description: 'Payment 4',
    userId: 2,
    Type: 2,
    firstPaymentDate: new Date(),
    creditCardId: 3,
    fixedPayment: false
  }])
}