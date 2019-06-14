import axios from 'axios'
import { tokenStorage } from '../storage/index'
import { Actions } from 'react-native-router-flux'

const apiUrl = 'https://appcashflow.herokuapp.com/api'
// const apiUrl = 'http://localhost:5000/api'

axios.interceptors.response.use(response => response, err => {
  const { request, status } = err.response
  if (status === 401 && !request.responseURL.endsWith('/api/token')) {
    tokenStorage.save(null)
    Actions.reset()
    Actions.login()
  }
  return Promise.reject(err)
})

const sendRequest = async (method, url, useToken, data) => {
  let headers
  if (useToken) {
    headers = { Authorization: `Bearer ${await tokenStorage.get()}` }
  }

  return axios({
    method: method,
    headers: headers,
    url: apiUrl + url,
    data: data
  }).then(res => res.data)
    .catch(err => {
      throw {
        message: err.response.status === 400 ? err.response.data.message : err.response.data,
        status: err.response.status
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