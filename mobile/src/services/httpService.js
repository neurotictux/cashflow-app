import axios from 'axios'
import { TokenStorage } from '../storage/index'
import { Actions } from 'react-native-router-flux'

const apiUrl = 'https://appcashflow.herokuapp.com/api'
// const apiUrl = 'http://localhost:5000/api'

axios.interceptors.response.use(response => response, err => {
  // console.log(err)
  const { request, status } = err.response
  if (status === 401 && !request.responseURL.endsWith('/api/token')) {
    TokenStorage.save(null)
    Actions.reset()
    Actions.login()
  }
  return Promise.reject(err)
})

const sendRequest = (method, url, headers, data) => {
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

const getHeaders = () => ({ Authorization: `Bearer ${TokenStorage.get()}` })

export default {
  getNotAuthenticated: (url) => sendRequest('get', url),
  postWithoutToken: (url, body) => sendRequest('post', url, null, body),
  get: (url) => sendRequest('get', url, getHeaders()),
  post: (url, body) => sendRequest('post', url, getHeaders(), body),
  put: (url, body) => sendRequest('put', url, getHeaders(), body),
  delete: (url, body) => sendRequest('delete', url, getHeaders(), body)
}