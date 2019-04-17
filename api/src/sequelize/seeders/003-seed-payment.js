export default {
  up: (queryInterface) => queryInterface.bulkInsert('Payment', [{
    description: 'Payment 1',
    userId: 1,
    cost: 256.84,
    plots: 5,
    Type: 1,
    firstPayment: new Date(),
    creditCardId: 2,
    plotsPaid: 2,
    fixedPayment: false,
    SinglePlot: false
  }, {
    description: 'Payment 1',
    userId: 1,
    cost: 1800.87,
    plots: 24,
    Type: 2,
    firstPayment: new Date(),
    creditCardId: 1,
    plotsPaid: 2,
    fixedPayment: false,
    SinglePlot: false
  }, {
    description: 'Payment 3',
    userId: 2,
    cost: 1256.32,
    plots: 5,
    Type: 1,
    firstPayment: new Date(),
    creditCardId: 3,
    plotsPaid: 2,
    fixedPayment: false,
    SinglePlot: false
  }, {
    description: 'Payment 4',
    userId: 2,
    cost: 25.47,
    plots: 10,
    Type: 2,
    firstPayment: new Date(),
    creditCardId: 3,
    plotsPaid: 2,
    fixedPayment: false,
    SinglePlot: false
  }])
}