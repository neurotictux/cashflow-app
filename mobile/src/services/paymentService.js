import httpService from './httpService'

const get = () => httpService.get('/payment')
const getFuture = (startDate, endDate) => httpService.get(`/payment-estimative?startDate=${startDate}&endDate=${endDate}`)
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