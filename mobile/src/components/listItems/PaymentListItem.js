import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { toReal } from '../../utils/string'
import { PaymentType, Colors } from '../../utils/constants'

export default class PaymentListItem extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { payment } = this.props
    return (
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold' }}>{payment.description}</Text>
          <Text style={{ color: payment.type === PaymentType.Income ? Colors.moneyIncome : Colors.moneyExpense, fontWeight: 'bold' }}>{toReal(payment.cost)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{payment.firstPaymentFormatted}</Text>
          <Text style={{ fontWeight: 'bold' }}>{payment.fixedPayment ? 'Mensal' : payment.singlePlot ? 'Único' : `${payment.plotsPaid}/${payment.plots}`}</Text>
        </View>
      </View>
    )
  }
}