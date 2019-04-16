import React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import createHistory from 'history/createHashHistory'
import CreditCards from '../../scenes/credit-cards/CreditCards'
import Payment from '../../scenes/payments/Payment'
import FuturePayment from '../../scenes/payments/Future'

const history = createHistory()
const isAuthenticated = true
const freeRoutes = ['/', '/about']

let currentPath = location.hash.replace('#', '')

export const getCurrentPath = () => currentPath

history.listen((location, action) => {
  if (freeRoutes.indexOf(location.pathname) === -1 && !isAuthenticated) {
    window.location.hash = '#/'
    currentPath = '/'
  } else
    currentPath = location.pathname
})

export default class AppRouter extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact={true} component={Payment} />
        <Route path="/my-payments" component={Payment} />
        <Route path="/credit-cards" component={CreditCards} />
        <Route path="/payment-future" component={FuturePayment} />
      </Switch>
    )
  }
}