import { DataTypes } from 'sequelize'

export default {
  TABLE_NAME: 'CreditCard',
  Model: {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    }
  },
  Attributes: {
    freezeTableName: 'CreditCard',
    undercored: false,
    updatedAt: false,
    createdAt: false
  }
}