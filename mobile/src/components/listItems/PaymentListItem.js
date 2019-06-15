import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'

import { toReal, toDateFormat } from '../../utils/string'
import { PaymentType, Colors } from '../../utils/constants'

const PaymentListItem = ({ payment: { installments, description, type, fixedPayment } }) => {
  const cost = installments.map(p => p.cost).reduce((sum, val) => sum + val)
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold' }}>{description}</Text>
        <Text style={{
          color: type === PaymentType.Income ? Colors.moneyIncome : Colors.moneyExpense,
          fontWeight: 'bold'
        }}>{toReal(cost)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{toDateFormat(installments[0].date, 'MM/yyyy')}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          {fixedPayment ? 'Mensal' : installments.length === 1 ? 'Único' : `${installments.filter(p => p.paid).length}/${installments.length}`}
        </Text>
      </View>
    </View>
  )
}

PaymentListItem.propTypes = {
  payment: PropTypes.object
}

export default PaymentListItem