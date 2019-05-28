export { PaymentStorage } from './paymentStorage'

// const keys = {
//   PAYMENTS: '@CashFlow:PAYMENTS',
//   PAYMENTS_ID: '@CashFlow:PAYMENTS:ID',
//   TOKEN: '@CashFlow:TOKEN',
//   FUTURE_PAYMENTS: '@CashFlow:FUTURE_PAYMENTS',
//   USER: '@CashFlow:USER',
// }

// export const PaymentStorage

// let currentToken = ''

// AsyncStorage.getItem(keys.TOKEN).then(t => currentToken = t)

// export const TokenStorage = {
//   get: () => currentToken,
//   getAsync: () => AsyncStorage.getItem(keys.TOKEN),
//   save: async (token) => {
//     currentToken = token
//     if (token)
//       return await AsyncStorage.setItem(keys.TOKEN, token)
//     else
//       return await AsyncStorage.removeItem(keys.TOKEN)
//   }
// }

// export const UserStorage = {
//   get: async () => JSON.parse(await AsyncStorage.getItem(keys.USER)),
//   save: async user => {
//     if (user)
//       return await AsyncStorage.setItem(keys.USER, JSON.stringify(user))
//     else
//       return await AsyncStorage.removeItem(keys.USER)
//   }
// }

// export const PaymentService = {
//   getAll: async () => {
//     const payments = await AsyncStorage.getItem(keys.PAYMENTS)
//     return payments ? JSON.parse(payments) : []
//   },
//   save: async (p) => {

//     if (!p.type)
//       throw 'Invalid type.'

//     if (!p.description)
//       throw 'Invalid description.'

//     if (!p.cost || isNaN(p.cost))
//       throw 'Invalid cost.'

//     p.cost = fromMoney(p.cost)

//     if (!p.date)
//       throw 'Invalid date.'

//     p.cost = Number(p.cost)

//     let payments = await AsyncStorage.getItem(keys.PAYMENTS)
//     payments = payments ? JSON.parse(payments) : []
//     if (p.appId) {
//       payments = payments.filter(x => x.appId !== p.appId)
//     } else {
//       p.appId = Number(await AsyncStorage.getItem(keys.PAYMENTS_ID))
//       if (!p.appId)
//         p.appId = 1
//       await AsyncStorage.setItem(keys.PAYMENTS_ID, (p.appId + 1).toString())
//     }
//     payments.push(p)
//     return await AsyncStorage.setItem(keys.PAYMENTS, JSON.stringify(payments))
//   },
//   remove: async (id) => {
//     let payments = await AsyncStorage.getItem(keys.PAYMENTS)
//     payments = payments ? JSON.parse(payments) : []
//     payments = payments.filter(p => p.appId !== id)
//     return await AsyncStorage.setItem(keys.PAYMENTS, JSON.stringify(payments))
//   }
// }

// export const PaymentStorage = {
//   getFuture: async () => JSON.parse(await AsyncStorage.getItem(keys.FUTURE_PAYMENTS)),
//   saveFuture: async (payments) => {
//     if (payments)
//       return await AsyncStorage.setItem(keys.FUTURE_PAYMENTS, JSON.stringify(payments))
//     else
//       return await AsyncStorage.removeItem(keys.FUTURE_PAYMENTS)
//   }
// }