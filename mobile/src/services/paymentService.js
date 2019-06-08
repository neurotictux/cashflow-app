import httpService from './httpService'

export default {
  getAll: () => httpService.get('/payments'),
  save: payment => {

    // return payment.id ?
    //   httpService.put('/payments', payment)
    //   : httpService.post('/payments', payment)
  }
}