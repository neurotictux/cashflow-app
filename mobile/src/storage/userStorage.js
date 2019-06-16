import AsyncStorage from '@react-native-community/async-storage'
const USER = '@CashFlow:USER'

const get = async () => JSON.parse(await AsyncStorage.getItem(USER)) || {}
const save = async (user) => {
  const newUser = { ...await get(), ...user }
  await AsyncStorage.setItem(USER, JSON.stringify(newUser))
  return newUser
}

export const userStorage = {
  get,
  save,
}