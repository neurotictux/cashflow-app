import { AsyncStorage } from 'react-native'

const KEY = '@CashFlow:CARDS'

const getByUser = async () => {
  return JSON.parse(await AsyncStorage.getItem(KEY)) || []
}

const create = async (card) => {
  const cards = (await getByUser())
  card.appId = 1
  cards.array.forEach(e => {
    if (e.appId >= card.appId)
      card.appId = e.appId + 1
  })
  cards.push(card)
  await AsyncStorage.setItem(KEY, cards)
  return cards
}

const update = async (card) => {
  const cards = (await getByUser()).filter(p => p.appId !== card.appId)
  card.updatedAt = new Date()
  if (card.sync !== 'D')
    card.sync = 'U'
  cards.push(card)
  cards.sort((a, b) => a.appId < b.appId ? -1 : a.appId > b.appId ? 1 : 0)
  await AsyncStorage.setItem(KEY, cards)
  return cards
}

const remove = (card) => {
  card.sync = 'D'
  return update(card)
}

export const PaymentStorage = {
  getByUser,
  create,
  update,
  remove
}