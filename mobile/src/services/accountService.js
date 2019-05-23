import httpService from './httpService'

export default {
  token: (email, password) => httpService.postWithoutToken('/token', { email, password })
}