import Sequelize from 'sequelize'

const sequelize = new Sequelize.Sequelize('sqlite:finance.test.db')

class Payment extends Sequelize.Model { }

Payment.init({
  id: {
    type: Sequelize.NUMBER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  userId: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  cost: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  plots: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  Type: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  firstPayment: {
    type: Sequelize.DATE,
    allowNull: false
  },
  creditCardId: {
    type: Sequelize.NUMBER,
    allowNull: true
  },
  plotsPaid: {
    type: Sequelize.NUMBER,
    allowNull: false
  },
  fixedPayment: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  SinglePlot: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
}, { sequelize, modelName: 'Payment' })

export const db = {
  Sequelize,
  Payment
}