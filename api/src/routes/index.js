import paymentRoute from './payment'
import creditCardRoute from './creditCard'

export const mapRoutes = (app) => {
  paymentRoute(app)
  creditCardRoute(app)
}