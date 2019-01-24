import axios from 'axios'
import { TokenStorage } from '../storage/index'

const apiUrl = 'https://financemanagerweb.herokuapp.com/api'

const sendRequest = (method, url, headers, data) => {
  return axios({
    method: method,
    headers: headers,
    url: apiUrl + url,
    data: data
  }).then(res => res.data)
    .catch(err => {
      throw {
        message: err.response.data,
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