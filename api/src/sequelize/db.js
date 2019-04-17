import Sequelize from 'sequelize'

export const PaymentModel = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  cost: {
    type: Sequelize.NUMBER(),
    allowNull: false
  },
  plots: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  Type: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  firstPayment: {
    type: Sequelize.DATE,
    allowNull: false
  },
  creditCardId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  plotsPaid: {
    type: Sequelize.INTEGER,
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
}

export const CreditCardModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING
  },
  userId: {
    allowNull: false,
    type: Sequelize.INTEGER
  }
}

export const UserModel = {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: true,
    type: Sequelize.DATE
  },
  lastAccess: {
    allowNull: true,
    type: Sequelize.DATE
  }
}

const sequelize = new Sequelize.Sequelize('sqlite:finance.test.db')

class Payment extends Sequelize.Model { }
class CreditCard extends Sequelize.Model { }
class User extends Sequelize.Model { }

Payment.init(PaymentModel, { sequelize, modelName: 'Payment' })
CreditCard.init(CreditCardModel, { sequelize, modelName: 'CreditCard' })
User.init(UserModel, { sequelize, modelName: 'User' })

export const db = {
  Sequelize,
  sequelize,
  Payment,
  CreditCard,
  User
}