import httpService from './httpService'

const get = () => httpService.get(`/payment`)
const getFuture = (forecastAt) => httpService.get(`/payment/FuturePayments?forecastAt=${forecastAt}`)
const create = (q) => httpService.post('/payment', q)
const update = (q) => httpService.put('/payment', q)
const remove = (id) => httpService.delete(`/payment/${id}`)

export default {
  get,
  getFuture,
  create,
  update,
  remove
}