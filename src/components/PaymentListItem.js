import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Card } from 'react-native-material-ui'
import { toMoney } from '../utils/string'

export class PaymentListItem extends Component {

  edit() {
    if (this.props.onEdit)
      this.props.onEdit(this.props.payment)
  }

  render() {
    return (
      <Card onPress={() => this.edit()}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end', alignItems: 'center' }}>
            <Text>{this.props.payment.description}</Text>
            <Text style={{ color: '#0F0', fontWeight: 'bold' }}>{this.props.payment.paid ? 'SETTLED' : ''}</Text>
            <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>{toMoney(this.props.payment.cost)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
            <Text>{this.props.payment.date}</Text>
            <Text style={{ fontWeight: 'bold', color: (this.props.payment.type === 'LOSS' ? '#F00' : '#00F') }}>{this.props.payment.type}</Text>
          </View>
        </View>
      </Card>
    )
  }
}