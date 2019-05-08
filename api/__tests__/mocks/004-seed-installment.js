export default {
  up: (queryInterface) => queryInterface.bulkInsert('Installment', [{
    paymentId: 1,
    cost: 25,
    number: 1,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25,
    number: 2,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25,
    number: 3,
    date: new Date()
  }, {
    paymentId: 1,
    cost: 25,
    number: 4,
    date: new Date()
  }, { // Salário
    paymentId: 5,
    cost: 2000,
    number: 1,
    date: new Date('01/01/2019')
  }, { // Internet
    paymentId: 6,
    cost: 88,
    number: 1,
    date: new Date('01/03/2019')
  }, { // Computador
    paymentId: 7,
    cost: 100,
    number: 1,
    date: new Date('05/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 2,
    date: new Date('06/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 3,
    date: new Date('07/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 4,
    date: new Date('08/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 5,
    date: new Date('09/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 6,
    date: new Date('10/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 7,
    date: new Date('11/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 8,
    date: new Date('12/01/2019')
  }, {
    paymentId: 7,
    cost: 100,
    number: 9,
    date: new Date('01/01/2020')
  }, {
    paymentId: 7,
    cost: 100,
    number: 10,
    date: new Date('02/01/2020')
  }, { // Televisão
    paymentId: 8,
    cost: 100,
    number: 1,
    date: new Date('11/01/2019')
  }, {
    paymentId: 8,
    cost: 100,
    number: 2,
    date: new Date('12/01/2019')
  }, {
    paymentId: 8,
    cost: 100,
    number: 3,
    date: new Date('01/01/2020')
  }, {
    paymentId: 8,
    cost: 100,
    number: 4,
    date: new Date('02/01/2020')
  }, { // Balcão
    paymentId: 9,
    cost: 100,
    number: 1,
    date: new Date('11/01/2019')
  }, {
    paymentId: 9,
    cost: 100,
    number: 2,
    date: new Date('12/01/2019')
  }, {
    paymentId: 9,
    cost: 100,
    number: 3,
    date: new Date('01/01/2020')
  }, {
    paymentId: 9,
    cost: 100,
    number: 4,
    date: new Date('02/01/2020')
  }
  ])
}