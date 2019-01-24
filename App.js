/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Store } from './src/store'
import { Router, Scene } from 'react-native-router-flux'

import { Login, NewPayment, Payments, Simulation, Future } from './src/scenes'

export default class App extends Component {

  render() {
    return (
      <Provider store={Store}>
        <Router>
          <Scene key="root">
            <Scene key="login"
              component={Login}
              title="Login"
              hideNavBar={true}
              initial
            />
            <Scene key="payments"
              component={Payments}
              title="Payments"
              hideNavBar={true}
            />
            <Scene key="newPayment"
              component={NewPayment}
              title="New Payment" />
            <Scene key="simulation"
              component={Simulation}
              title="Simulation"
            />
            <Scene key="futurePayments"
              component={Future}
              title="Pagamentos Futuros"
              hideNavBar={true}
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
