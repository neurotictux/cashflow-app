import { DataTypes } from 'sequelize'

export default {
  TABLE_NAME: 'User',
  Model: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    lastAccess: {
      allowNull: true,
      type: DataTypes.DATE
    }
  },
  Attributes: {
    freezeTableName: 'User',
    undercored: false,
    updatedAt: false,
    createdAt: false
  }
}