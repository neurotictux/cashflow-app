import httpService from './httpService'

export default {
  post: (email, password) => httpService.postWithoutToken('/token', { email, password })
}