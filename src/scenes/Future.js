import React from 'react'
import { Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Toolbar } from 'react-native-material-ui'

import { PaymentService } from '../services'
// import { PaymentService } from '../storage'

export default class Future extends React.Component {

  componentDidMount() {
    PaymentService.get()
      .then(res => console.warn(res))
      .catch(err => console.warn(err))
  }

  render() {
    return (
      <View>
        <Toolbar
          style={{ container: { backgroundColor: '#282' } }}
          leftElement="menu"
          centerElement="Pagamentos Futuros"
          searchable={{
            autoFocus: true,
            placeholder: 'Search',
          }}
          rightElement={{
            menu: {
              icon: "more-vert",
              labels: ['Refresh']
            }
          }}
          onRightElementPress={(label) => this.menuSelected(label.index)}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Text style={{ color: '#C00', marginTop: 10 }}>Pagamentos Futuros</Text>
        </View>
      </View>
    )
  }
}