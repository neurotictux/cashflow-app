import { Sequelize } from 'sequelize'

import CreditCardProps from './creditCard'
import UserProps from './user'
import PaymentProps from './payment'
import InstallmentProps from './installment'
import Config from '../../config'

const sequelize = new Sequelize(Config[Config.NODE_ENV])

const CreditCard = sequelize.define(CreditCardProps.TABLE_NAME, CreditCardProps.Model, CreditCardProps.Attributes)
const User = sequelize.define(UserProps.TABLE_NAME, UserProps.Model, UserProps.Attributes)
const Payment = sequelize.define(PaymentProps.TABLE_NAME, PaymentProps.Model, PaymentProps.Attributes)
const Installment = sequelize.define(InstallmentProps.TABLE_NAME, InstallmentProps.Model, InstallmentProps.Attributes)

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