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
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creditCardId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'CreditCard', key: 'id' }
    },
    fixedPayment: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    invoice: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    sync: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    }
  },
  Attributes: {
    freezeTableName: 'Payment',
    undercored: false,
    updatedAt: false,
    createdAt: false
  }
}