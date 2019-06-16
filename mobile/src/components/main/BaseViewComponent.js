import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'

import { userStorage } from '../../storage'

import { Tabs } from '../index'

class BaseViewComponent extends React.Component {

  menuSelected(idx) {
    if (idx === 1) {
      userStorage.save({ token: null }).then(() => Actions.login())
    } else if (this.props.menuSelected)
      this.props.menuSelected(idx)
  }

  toPage(idx) {
    switch (idx) {
      case 0:
        Actions.futurePayments()
        break
      case 1:
        Actions.payments()
        break
      case 2:
        Actions.cards()
        break
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#DDD' }}>
        <Toolbar
          style={{ container: { backgroundColor: '#282' } }}
          centerElement={this.props.title}
          searchable={{
            autoFocus: false,
            placeholder: 'Busca...',
            onChangeText: (val) => this.props.onSearchChanged ? this.props.onSearchChanged(val) : null,
            onSearchClosed: () => this.props.onSearchClosed ? this.props.onSearchClosed() : null
          }}
          rightElement={{
            menu: {
              icon: 'more-vert',
              labels: ['Atualizar', 'Sair']
            }
          }}
          onRightElementPress={label => this.menuSelected(label.index)}
        />
        <View style={{ flex: 1 }}>
          {this.props.loading ? <ActivityIndicator size="large" /> : this.props.children}
        </View>
        <Tabs currentPage={this.props.currentPage} toPage={(i) => this.toPage(i)} />
      </View>
    )
  }
}

BaseViewComponent.propTypes = {
  title: PropTypes.string,
  menuSelected: PropTypes.func,
  loading: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  onSearchChanged: PropTypes.func,
  onSearchClosed: PropTypes.func,
  children: PropTypes.any
}

export default BaseViewComponent