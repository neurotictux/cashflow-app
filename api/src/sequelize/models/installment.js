import { DataTypes } from 'sequelize'

export default {
  TABLE_NAME: 'Installment',
  Model: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Payment', key: 'id' }
    },
    cost: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  Attributes: {
    freezeTableName: 'Installment',
    undercored: false,
    updatedAt: false,
    createdAt: false
  }
}