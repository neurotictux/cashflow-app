/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, Scene } from 'react-native-router-flux'
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui'

import { Store } from './src/store'
import { Login, NewPayment, Payments, Simulation, Future } from './src/scenes'

const uiTheme = {
  palette: {
    primaryColor: COLOR.green500,
  },
  toolbar: {
    container: {
      height: 50,
    },
  },
}

export default class App extends Component {

  render() {
    return (
      <ThemeContext.Provider value={getTheme(uiTheme)}>
        <Provider store={Store}>
          <Router>
            <Scene key="root">
              <Scene key="login"
                component={Login}
                title="Login"
                hideNavBar={true}
                type='reset'
              />
              <Scene key="payments"
                component={Payments}
                title="Pagamentos"
                hideNavBar={true}
                initial
              />
              <Scene key="newPayment"
                component={NewPayment}
                title="Novo Pagamento" />
              <Scene key="simulation"
                component={Simulation}
                title="Simulation"
              />
              <Scene key="futurePayments"
                component={Future}
                title="Pagamentos Futuros"
                hideNavBar={true}
                type='reset'
              />
            </Scene>
          </Router>
        </Provider>
      </ThemeContext.Provider>
    )
  }
}
