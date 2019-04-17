import paymentRoute from './payment'
import creditCardRoute from './creditCard'
import userRoute from './user'

export const mapRoutes = (app) => {
  paymentRoute(app)
  creditCardRoute(app)
  userRoute(app)
}