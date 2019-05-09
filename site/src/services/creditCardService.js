import httpService from './httpService'

const get = () => httpService.get(`/credit-card`)
const create = (q) => httpService.post('/credit-card', q)
const update = (q) => httpService.put('/credit-card', q)
const remove = (id) => httpService.delete(`/credit-card/${id}`)

export default {
  get,
  create,
  update,
  remove
}