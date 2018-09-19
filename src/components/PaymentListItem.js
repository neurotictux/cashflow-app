import React, { Component } from 'react'
import { ListView, View, Text } from 'react-native'
import { Card } from 'react-native-material-ui'
import { toMoney, toDate } from '../utils/string'
import Balloon from 'react-native-balloon'
import { PaymentType } from '../utils/constants'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

class PaymentListItem extends Component {

  constructor(props) {
    super(props)
    this.updateList = this.updateList.bind(this)

    this.state = {}
    this.updateList()
  }

  componentDidUpdate() {
    console.log('didUpdate')
    this.updateList()
  }

  updateList() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const payments = this.props.payments.filter(p => p.date === this.props.date)

    const paymentsSum = this.props.payments.filter(p => toDate(p.date) <= toDate(this.props.date))

    const sumCost = (type) => {
      const arr = paymentsSum.filter(p => p.type === type)
      let sum = 0
      arr.forEach(p => sum += p.cost)
      return sum
    }

    const sum = (sumCost(PaymentType.GAIN) - sumCost(PaymentType.LOSS)).toFixed(2)
    this.state = {
      sum: '$ ' + sum,
      sumColor: sum < 0 ? '#F44' : '#4a4',
      dataSource: ds.cloneWithRows(payments)
    }
  }

  edit(p) {
    Actions.newPayment({
      payment: p,
      title: 'Edit Payment'
    })
  }

  render() {
    return (
      <View>
        <Balloon
          containerStyle={{ alignSelf: 'center', padding: 2, marginTop: 30 }}
          borderColor="#2E86C1"
          backgroundColor="#D6EAF8"
          borderWidth={1}
          borderRadius={10}
          triangleOffset={'50%'}
          triangleSize={10}
          height={26}
          onPress={() => console.log("press")}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text>{this.props.date} - </Text>
            <Text style={{ color: this.state.sumColor, fontWeight: 'bold' }}>{this.state.sum}</Text>
          </View>
        </Balloon>
        <ListView
          enableEmptySections={true}
          collapsable={true}
          paddingLeft={10}
          paddingRight={10}
          marginTop={10}
          dataSource={this.state.dataSource}
          renderRow={p =>
            <Card onPress={() => this.edit(p)}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end', alignItems: 'center' }}>
                  <Text>{p.description}</Text>
                  <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>{toMoney(p.cost)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                  <Text>{p.date}</Text>
                  <Text style={{ color: '#aaa', fontWeight: 'bold' }}>{p.paid ? 'PAID' : ''}</Text>
                  <Text style={{ fontWeight: 'bold', color: (p.type === 'LOSS' ? '#F44' : '#4A4') }}>{p.type}</Text>
                </View>
              </View>
            </Card>
          } />
      </View>
    )
  }
}


// const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
// const payments = props.payments.filter(p => p.date === this.props.date)

// const paymentsSum = props.payments.filter(p => toDate(p.date) <= toDate(this.props.date))

// const sumCost = (type) => {
//   const arr = paymentsSum.filter(p => p.type === type)
//   let sum = 0
//   arr.forEach(p => sum += p.cost)
//   return sum
// }

// const sum = (sumCost(PaymentType.GAIN) - sumCost(PaymentType.LOSS)).toFixed(2)

// this.state = {
//   sum: '$ ' + 0,
//   sumColor: 0 < 0 ? '#F44' : '#4a4',
//   dataSource: ds.cloneWithRows([])
// }

const mapStateToProps = store => {
  return { payments: store.appState.payments }
}

export default connect(mapStateToProps)(PaymentListItem)