import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core'
import MainComponent from './components/main/MainComponent'

import { AppTheme } from './helpers/themes'
import { Store } from './store'

import './App.css'

class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <MuiThemeProvider theme={AppTheme}>
          <MainComponent />
        </MuiThemeProvider>
      </Provider>
    )
  }
}

if (location.protocol === 'http:' && location.host.indexOf('localhost') === -1)
  location.protocol = 'https:'

ReactDOM.render(<App />, document.getElementById('app'))

module.hot.accept()