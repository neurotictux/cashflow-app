import axios from 'axios'
import { userStorage } from '../storage'
import { Actions } from 'react-native-router-flux'

// const apiUrl = 'https://appcashflow.herokuapp.com/api'
const apiUrl = 'http://localhost:3000/api'

axios.interceptors.response.use(response => response, err => {
  const { request, status } = err.response
  if (status === 401 && !request.responseURL.endsWith('/api/token')) {
    userStorage.saveToken(null)
    Actions.reset()
    Actions.login()
  }
  return Promise.reject(err)
})

const sendRequest = async (method, url, useToken, data) => {
  let headers
  if (useToken) {
    headers = { Authorization: `Bearer ${await userStorage.get()}` }
  }

  const req = { method, headers, url: apiUrl + url, data }

  return axios(req).then(res => res.data)
    .catch(err => {
      const { data, status } = err.response || { status: -1, data: { message: 'Erro desconhecido.' } }
      throw {
        message: status === 400 ? data.message : data,
        status: status
      }
    })
}

export default {
  getNotAuthenticated: (url) => sendRequest('get', url),
  postWithoutToken: (url, body) => sendRequest('post', url, false, body),
  get: (url) => sendRequest('get', url, true),
  post: (url, body) => sendRequest('post', url, true, body),
  put: (url, body) => sendRequest('put', url, true, body),
  delete: (url, body) => sendRequest('delete', url, true, body)
}