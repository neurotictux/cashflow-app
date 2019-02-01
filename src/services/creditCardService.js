import httpService from './httpService'

const get = () => httpService.get(`/creditcard`)
const create = (q) => httpService.post('/creditcard', q)
const update = (q) => httpService.put('/creditcard', q)
const remove = (id) => httpService.delete(`/creditcard/${id}`)

export default {
  get,
  create,
  update,
  remove
}