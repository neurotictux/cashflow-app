import React from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

import { toReal } from '../../utils/string'
import { Colors, PaymentType } from '../../utils/constants'
import { FadeInView } from './..'

class PaymentFutureSubListItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = { details: false }
  }

  render() {
    const { payment } = this.props
    return (
      <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
        <View style={{ marginLeft: 10, flexDirection: 'row' }}>
          <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 10 }}>{this.props.payment.description}</Text>
          </View>
          <View style={{ width: 30 }}>
            <Text style={{ fontSize: 10 }}>
              {payment.qtdInstallments > 1 ? `${payment.number}/${payment.qtdInstallments}` : ''}
            </Text>
          </View>
          <View style={{ width: 90 }}>
            <Text style={{ fontSize: 12, color: this.props.payment.type === PaymentType.Income ? Colors.moneyIncome : Colors.moneyExpense }}>{toReal(this.props.payment.cost)}</Text>
          </View>
          {
            this.props.payment.isCreditCard ?
              <View>
                <TouchableHighlight onPress={() => this.setState({ details: !this.state.details })}>
                  <Icon
                    name={this.state.details ? 'chevron-up' : 'chevron-down'}
                    style={{ fontSize: 12, height: 22 }} />
                </TouchableHighlight>
              </View>
              : null
          }
        </View>
        {this.state.details ?
          <FadeInView style={{ marginBottom: 10 }}>
            {this.props.payment.items.map((p, i) =>
              <View key={i} style={{ marginLeft: 20, flexDirection: 'row' }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ fontSize: 10 }}>{p.description}</Text>
                </View>
                <View style={{ width: 30 }}>
                  <Text style={{ fontSize: 10 }}>
                    {p.plots ? `${p.plotsPaid}/${p.plots}` : ''}
                  </Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text style={{ fontSize: 10, color: p.type === PaymentType.Income ? Colors.moneyIncome : Colors.moneyExpense }}>{toReal(p.cost)}</Text>
                </View>
              </View>)}
          </FadeInView>
          : null
        }
      </View>
    )
  }
}

PaymentFutureSubListItem.propTypes = {
  payment: PropTypes.object.isRequired
}

export default PaymentFutureSubListItem