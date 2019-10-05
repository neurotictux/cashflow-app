import AsyncStorage from '@react-native-community/async-storage'

const KEY = '@CashFlow:PAYMENTS'

const get = async () => JSON.parse(await AsyncStorage.getItem(KEY)) || []

const save = (payments) => AsyncStorage.setItem(KEY, JSON.stringify(payments || []))

export const paymentStorage = {
  get,
  save
}