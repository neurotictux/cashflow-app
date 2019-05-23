import React from 'react'
import Balloon from 'react-native-balloon'
import { Text, View } from 'react-native'
import { Button, Card } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { monthName, toReal } from '../../utils/string'
import { Colors } from '../../utils/constants'
import PaymentFutureSubListItem from './PaymentFutureSubListItem'
import { FadeInView } from './..'

const fontSize = 12

const styles = {
  moneyIncome: {
    color: Colors.moneyIncome,
    fontWeight: 'bold',
    fontSize: fontSize
  },
  moneyExpense: {
    color: Colors.moneyExpense,
    fontWeight: 'bold',
    fontSize: fontSize
  },
  rowSum: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    fontSize: fontSize
  }
}

export default class PaymentFutureListItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      details: false
    }
    console.log(props.payments)
  }

  render() {
    return (
      <Card>
        <Balloon
          containerStyle={{ alignSelf: 'center', padding: 2, marginTop: 10 }}
          borderColor="#2E86C1"
          backgroundColor="#D6EAF8"
          borderWidth={1}
          borderRadius={10}
          triangleOffset={'50%'}
          triangleSize={10}
          height={26}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{`${monthName(this.props.month)} - ${this.props.year}`}</Text>
          </View>
        </Balloon>
        {this.state.details ?
          <FadeInView duration={700}>
            {this.props.payments.payments.map((p, i) => <PaymentFutureSubListItem key={i} payment={p} />)}
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Renda: </Text>
              <Text style={styles.moneyIncome}>{toReal(this.props.payments.costIncome)}</Text>
            </View>
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Despesa: </Text>
              <Text style={styles.moneyExpense}>{toReal(this.props.payments.costExpense)}</Text>
            </View>
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Resto: </Text>
              <Text style={this.props.payments.total < 0 ? styles.moneyExpense : styles.moneyIncome}>{toReal(this.props.payments.total)}</Text>
            </View>
          </FadeInView>
          : null}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={this.props.payments.accumulatedCost < 0 ? styles.moneyExpense : styles.moneyIncome}>{toReal(this.props.payments.accumulatedCost)}</Text>
          <Button text=" " onPress={() => this.setState({ details: !this.state.details })}
            icon={<Icon
              name={this.state.details ? 'chevron-up' : 'chevron-down'}
              style={{ fontSize: 20, height: 22 }} />} />
        </View>
      </Card>
    )
  }
}
