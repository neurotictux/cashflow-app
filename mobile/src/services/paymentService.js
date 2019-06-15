import httpService from './httpService'

const get = () => httpService.get('/payment')
const getFuture = (startDate, endDate) => httpService.get(`/payment-estimative?startDate=${startDate}&endDate=${endDate}`)
const save = (q) => q.id ? httpService.put('/payment', q) : httpService.post('/payment', q)
const remove = (id) => httpService.delete(`/payment/${id}`)

export default {
  get,
  getFuture,
  save,
  remove
}