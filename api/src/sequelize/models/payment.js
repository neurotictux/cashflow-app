import { DataTypes } from 'sequelize'

export default {
  TABLE_NAME: 'Payment',
  Model: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'User', key: 'id' }
    },
    cost: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    plots: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firstPayment: {
      type: DataTypes.DATE,
      allowNull: false
    },
    creditCardId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'CreditCard', key: 'id' }
    },
    plotsPaid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fixedPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    SinglePlot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  },
  Attributes: {
    freezeTableName: 'Payment',
    undercored: false,
    updatedAt: false,
    createdAt: false
  }
}