import React from 'react'
import Balloon from 'react-native-balloon'
import { Text, View } from 'react-native'
import { Button, Card } from 'react-native-material-ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

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

class Invoices extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { cards } = this.props
    return (
      cards.length ?
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Text>FATURAS</Text>
          {cards.map((c, i) => (
            <View key={i}>
              <Text style={{ fontSize: 12, marginLeft: 10 }}>{c.name}</Text>
              <View style={{ marginLeft: 10 }}>
                {c.payments.map((p, i) => <PaymentFutureSubListItem key={i} payment={p} />)}
              </View>
            </View>
          ))}
        </View>
        : null
    )
  }
}

Invoices.propTypes = {
  cards: PropTypes.array.isRequired
}

class PaymentFutureListItem extends React.Component {

  constructor(props) {
    super(props)
    const cards = []
    const { payments } = props.payments
    payments.filter(p => p.invoice).forEach(p => {
      if (!cards.find(x => x.id === p.creditCard.id)) {
        cards.push(p.creditCard)
        p.creditCard.payments = payments.filter(x => x.creditCard && x.creditCard.id === p.creditCard.id)
      }
    })
    this.state = { details: false, cards }
  }

  render() {
    const { payments, costIncome, costExpense, total, accumulatedCost } = this.props.payments
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
            <Invoices cards={this.state.cards}></Invoices>
            {payments.filter(p => !p.invoice).map((p, i) => <PaymentFutureSubListItem key={i} payment={p} />)}
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Renda: </Text>
              <Text style={styles.moneyIncome}>{toReal(costIncome)}</Text>
            </View>
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Despesa: </Text>
              <Text style={styles.moneyExpense}>{toReal(costExpense)}</Text>
            </View>
            <View style={styles.rowSum}>
              <Text style={{ fontSize: fontSize }}>Resto: </Text>
              <Text style={total < 0 ? styles.moneyExpense : styles.moneyIncome}>{toReal(total)}</Text>
            </View>
          </FadeInView>
          : null}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={accumulatedCost < 0 ? styles.moneyExpense : styles.moneyIncome}>{toReal(accumulatedCost)}</Text>
          <Button text=" " onPress={() => this.setState({ details: !this.state.details })}
            icon={<Icon
              name={this.state.details ? 'chevron-up' : 'chevron-down'}
              style={{ fontSize: 20, height: 22 }} />} />
        </View>
      </Card>
    )
  }
}

PaymentFutureListItem.propTypes = {
  payments: PropTypes.object.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default PaymentFutureListItem