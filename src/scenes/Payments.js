import React, { Component } from 'react'
import { ListView, View, Text, StyleSheet, Button } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { Toolbar } from 'react-native-material-ui'
import { Actions } from 'react-native-router-flux'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { paymentsChanged } from '../actions'
import PaymentListItem from '../components/PaymentListItem'
import { PaymentService } from '../storage'
import { toDate, distinctMonths } from '../utils/string'
import { PaymentType } from '../utils/constants'

class Payments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sum: '$ 0.00',
      color: 'green',
      modalVisible: false,
      payments: []
    }

    this.openForecast = this.openForecast.bind(this)
    this.updateExpectedBalance = this.updateExpectedBalance.bind(this)
  }

  componentDidMount() {
    PaymentService.getAll()
      .then(res => this.props.paymentsChanged(res))
      .catch(err => console.warn(err))
  }

  openForecast() {
    this.setState({ modalVisible: true })
  }

  menuSelected(index) {
    switch (index) {
      case 0:
        break;
    }

  }

  updateExpectedBalance(date) {
    const payments = this.state.payments.filter(p => toDate(p.date) < toDate(date))
    const sumCost = (type) => {
      const arr = payments.filter(p => p.type === type)
      let sum = 0
      arr.forEach(p => sum += p.cost)
      return sum
    }
    const sum = (sumCost(PaymentType.GAIN) - sumCost(PaymentType.LOSS)).toFixed(2)
    this.setState({
      sum: '$ ' + sum,
      color: sum < 0 ? 'red' : 'green',
      date: date
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <View>
          <Modal isVisible={this.state.modalVisible}>
            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Expected Balance:</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: this.state.color }}>{this.state.sum}</Text>
              </View>
              <DatePicker
                style={{ width: 200, marginTop: 30 }}
                date={this.state.date}
                mode="date"
                placeholder="Maximum Date"
                format="DD-MM-YYYY"
                minDate="01-01-2000"
                maxDate="01-01-2030"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 40
                  }
                }}
                onDateChange={(date) => this.updateExpectedBalance(date)}
              />
              <View style={{ marginTop: 20, width: 100 }}>
                <Button onPress={() => this.setState({ modalVisible: false })} title="OK"></Button>
              </View>
            </View>
          </Modal>
        </View>

        <Toolbar
          style={{ container: { backgroundColor: '#282' } }}
          leftElement="menu"
          centerElement="Payments"
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

        <ListView
          collapsable={true}
          enableEmptySections={true}
          borderWidth={1}
          paddingLeft={10}
          paddingRight={10}
          borderColor={'#ccc'}
          marginTop={10}
          marginBottom={80}
          dataSource={this.props.months}
          renderRow={p => <PaymentListItem month={p} />}
        />

        <ActionButton offsetX={10} offsetY={10} buttonColor="#282">
          <ActionButton.Item buttonColor='#1abc9c' title="New Payment" onPress={() => Actions.newPayment({ payment: {} })}>
            <Icon name="plus" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Simulation" onPress={() => Actions.simulation()}>
            <Icon name="currency-usd" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>)
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

const mapStateToProps = store => ({
  payments: store.appState.payments,
  months: ds.cloneWithRows(distinctMonths(store.appState.dates))
})

const mapDispatchToProps = dispatch => bindActionCreators({ paymentsChanged }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Payments)