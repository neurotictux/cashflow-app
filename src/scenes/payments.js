import React, { Component } from 'react'
import { Button, ListView, View, Text, StyleSheet } from 'react-native'
import { Toolbar } from 'react-native-material-ui'
import { Actions } from 'react-native-router-flux'
import { PaymentListItem } from '../components/PaymentListItem'
import { PaymentService } from '../db/database'
import { toDate } from '../utils/string'
import { PaymentType } from '../utils/constants'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons';

const payments = [
  { description: 'Renner', cost: 356.98, type: PaymentType.LOSS },
  { description: 'Salary', cost: 1387.91, type: PaymentType.GAIN }
]

export class Payments extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: ds.cloneWithRows(payments),
      sum: '$ 0.00',
      color: 'red'
    }
  }

  componentDidMount() {
    this.refreshList()
  }

  componentDidUpdate() {
    console.log(this.state.color)
  }

  refreshList() {
    PaymentService.getAll().then(res => {
      const sumCost = (type) => {
        const arr = res.filter(p => p.type === type)
        let sum = 0
        arr.forEach(p => sum += p.cost)
        return sum
      }
      const sorted = res.sort((a, b) => toDate(a.date) > toDate(b.date) ? -1 : toDate(a.date) < toDate(b.date) ? 1 : 0)
      const sum = (sumCost(PaymentType.GAIN) - sumCost(PaymentType.LOSS)).toFixed(2)

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(sorted),
        sum: '$ ' + sum,
        color: sum < 0 ? 'red' : 'green'
      })
    }).catch(err => console.warn(err))
  }

  onEdit(payment) {
    Actions.newPayment({
      payment: payment,
      title: 'Edit Payment'
    })
  }

  onRemove(p) {
    if (p && p.appId) {
      PaymentService.remove(p.appId).then(() => {
        this.refreshList()
      })
    }
  }

  menuSelected(index) {
    switch (index) {
      case 0:
        this.refreshList()
        break;
    }

  }

  render() {
    return (
      <View style={{ flex: 1 }}>
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

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Expected Balance:</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: this.state.color }}>{this.state.sum}</Text>
        </View>

        <ListView
          collapsable={true}
          maxHeight={520}
          borderWidth={1}
          paddingLeft={10}
          paddingRight={10}
          borderColor={'#ccc'}
          marginTop={10}
          dataSource={this.state.dataSource}
          renderRow={p => <PaymentListItem
            payment={p}
            onEdit={(x) => this.onEdit(x)}
            onRemove={(x) => this.onRemove(x)} />
          }
        />

        <ActionButton offsetX={10} offsetY={10} buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => { }}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="New Payment" onPress={() => Actions.newPayment({ payment: {} })}>
            <Icon name="md-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

      </View >)
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});