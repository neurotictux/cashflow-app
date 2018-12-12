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

import Payments from './src/scenes/payments'
import NewPayment from './src/scenes/new-payment'
import { Simulation } from './src/scenes/simulation'

export default class App extends Component {

  render() {
    return (
      <Provider store={Store}>
        <Router>
          <Scene key="root">
            <Scene key="payments"
              component={Payments}
              title="Paymentss"
              hideNavBar={true}
              initial
              />
            <Scene key="newPayment"
              component={NewPayment}
              title="New Payment" />
            <Scene key="simulation"
              component={Simulation}
              title="Simulation"
                />
          </Scene>
        </Router>
      </Provider>
    );
  }
}
