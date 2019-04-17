'use strict'

module.exports = (sequelize, DataTypes) => {
  const CreditCard = sequelize.define('CreditCard', {
    id: DataTypes.NUMBER
  }, {})
  CreditCard.associate = function(models) {
    // associations can be defined here
  }
  return CreditCard
}