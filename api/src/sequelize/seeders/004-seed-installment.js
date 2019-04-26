export default {
  up: (queryInterface) => queryInterface.bulkInsert('Installment', [{
    paymentId: 1,
    cost: 25.80,
    number: 1,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25.80,
    number: 2,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25.80,
    number: 3,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25.80,
    number: 4,
    date: new Date()
  }])
}