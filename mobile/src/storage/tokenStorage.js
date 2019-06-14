import { AsyncStorage } from 'react-native'
const KEY = '@CashFlow:TOKEN'

let currentToken = ''

AsyncStorage.getItem(KEY).then(t => currentToken = t)

export const tokenStorage = {
  get: async () => currentToken || await AsyncStorage.getItem(KEY),
  save: async (token) => {
    currentToken = token
    if (token)
      return await AsyncStorage.setItem(KEY, token)
    else
      return await AsyncStorage.removeItem(KEY)
  }
}