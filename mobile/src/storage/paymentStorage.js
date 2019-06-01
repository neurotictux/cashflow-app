import { AsyncStorage } from 'react-native'

const KEY = '@CashFlow:PAYMENTS'

const getByUser = async () => {
  return JSON.parse(await AsyncStorage.getItem(KEY)) || []
}

const create = async (payment) => {
  const payments = (await getByUser())
  payment.appId = 1
  payments.forEach(e => {
    if (e.appId >= payment.appId)
      payment.appId = e.appId + 1
  })
  payments.push(payment)
  await AsyncStorage.setItem(KEY, payments)
  return payments
}

const update = async (payment) => {
  const payments = (await getByUser()).filter(p => p.appId !== payment.appId)
  payment.updatedAt = new Date()
  if (payment.sync !== 'D')
    payment.sync = 'U'
  payments.push(payment)
  payments.sort((a, b) => a.appId < b.appId ? -1 : a.appId > b.appId ? 1 : 0)
  await AsyncStorage.setItem(KEY, payments)
  return payments
}

const remove = (payment) => {
  payment.sync = 'D'
  return update(payment)
}

export const paymentStorage = {
  getByUser,
  create,
  update,
  remove
}