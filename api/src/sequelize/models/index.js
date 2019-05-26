import { Sequelize } from 'sequelize'

import CreditCardProps from './creditCard'
import UserProps from './user'
import PaymentProps from './payment'
import InstallmentProps from './installment'
import Config, { NODE_ENV } from '../../config'

const DbConfig = Config[NODE_ENV]

const sequelize = NODE_ENV === 'test' ?
  new Sequelize(DbConfig)
  : new Sequelize(DbConfig.DATABASE_URI, DbConfig)

const CreditCard = sequelize.define(CreditCardProps.TABLE_NAME, CreditCardProps.Model, CreditCardProps.Attributes)
const User = sequelize.define(UserProps.TABLE_NAME, UserProps.Model, UserProps.Attributes)
const Payment = sequelize.define(PaymentProps.TABLE_NAME, PaymentProps.Model, PaymentProps.Attributes)
const Installment = sequelize.define(InstallmentProps.TABLE_NAME, InstallmentProps.Model, InstallmentProps.Attributes)

Payment.hasMany(Installment, { as: 'installments', foreignKey: 'paymentId' })

export { CreditCard as CreditCard }
export { User as User }
export { Payment as Payment }
export { Installment as Installment }
export { Sequelize as Sequelize }
export { sequelize as sequelize }

export default {
  sequelize,
  Sequelize,
  CreditCard,
  User,
  Payment,
  Installment
}