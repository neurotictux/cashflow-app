import httpService from './httpService'

const get = () => httpService.get(`/payment`)
const getFuture = (forecastAt) => httpService.get(`/payment/FuturePayments?forecastAt=${forecastAt}`)
const create = (p) => httpService.post('/payment', p)
const update = (p) => httpService.put('/payment', p)
const remove = (id) => httpService.delete(`/payment/${id}`)

export default {
  get,
  getFuture,
  save: p => p.id ? update(p) : create(p),
  remove
}