import { AsyncStorage } from 'react-native'

const KEY = '@CashFlow:CARDS'

const getAll = async () => {
  const payments = JSON.parse(await AsyncStorage.getItem(KEY)) || []
  return payments.filter(p => p.sync !== 'D')
}

const create = async (card) => {
  const cards = (await getAll())
  card.appId = 1
  cards.forEach(e => {
    if (e.appId >= card.appId)
      card.appId = e.appId + 1
  })
  cards.push(card)
  await AsyncStorage.setItem(KEY, JSON.stringify(cards))
  return cards
}

const update = async (card) => {
  const cards = (await getAll()).filter(p => p.appId !== card.appId)
  card.updatedAt = new Date()
  if (card.sync !== 'D')
    card.sync = 'U'
  cards.push(card)
  cards.sort((a, b) => a.appId < b.appId ? -1 : a.appId > b.appId ? 1 : 0)
  await AsyncStorage.setItem(KEY, JSON.stringify(cards))
  return cards
}

const remove = async (card) => {
  if (card.id) {
    card.sync = 'D'
    return update(card)
  } else {
    const cards = (await getAll()).filter(p => p.appId !== card.appId)
    cards.sort((a, b) => a.appId < b.appId ? -1 : a.appId > b.appId ? 1 : 0)
    await AsyncStorage.setItem(KEY, JSON.stringify(cards))
    return cards
  }
}

export const creditCardStorage = {
  getAll,
  create,
  update,
  remove
}