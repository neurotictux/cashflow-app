import httpService from './httpService'
import { STORAGE_KEYS } from '../helpers/storageKeys'

const updateToken = (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token)

const login = user =>
  httpService.postNotAuthenticated('/token', user)
    .then(res => {
      updateToken(res.token)
      return httpService.get('/user')
    })

const createAccount = (account) =>
  httpService.postNotAuthenticated('/user', account)
    .then(res => {
      updateToken(res.token)
      return httpService.get('/user')
    })

const logout = () => updateToken(null)

export default {
  logout,
  login,
  createAccount
}