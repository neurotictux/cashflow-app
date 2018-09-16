import { AsyncStorage } from 'react-native'
import { fromMoney } from '../utils/string';

const keys = {
  PAYMENTS: '@CashFlow:PAYMENTS',
  PAYMENTS_ID: '@CashFlow:PAYMENTS:ID'
}

export const PaymentService = {
  getAll: async () => {
    const payments = await AsyncStorage.getItem(keys.PAYMENTS)
    return payments ? JSON.parse(payments) : []
  },
  save: async (p) => {

    if (!p.type)
      throw 'Invalid type.'

    if (!p.description)
      throw 'Invalid description.'

    if (!p.cost || isNaN(p.cost))
      throw 'Invalid cost.'

    p.cost = fromMoney(p.cost)

    if (!p.date)
      throw 'Invalid date.'

    p.cost = Number(p.cost)

    let payments = await AsyncStorage.getItem(keys.PAYMENTS)
    payments = payments ? JSON.parse(payments) : []
    if (p.appId) {
      payments = payments.filter(x => x.appId !== p.appId)
    } else {
      p.appId = Number(await AsyncStorage.getItem(keys.PAYMENTS_ID))
      if (!p.appId)
        p.appId = 1
      await AsyncStorage.setItem(keys.PAYMENTS_ID, (p.appId + 1).toString())
    }
    payments.push(p)
    return await AsyncStorage.setItem(keys.PAYMENTS, JSON.stringify(payments))
  },
  remove: async (id) => {
    let payments = await AsyncStorage.getItem(keys.PAYMENTS)
    payments = payments ? JSON.parse(payments) : []
    payments = payments.filter(p => p.appId !== id)
    return await AsyncStorage.setItem(keys.PAYMENTS, JSON.stringify(payments))
  }
}
