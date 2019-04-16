import React, { Component } from 'react'
import { ListView, Button, Text, View } from 'react-native'
import { Card } from 'react-native-material-ui'
import { PatternTextInput } from '../components'
import { toMoney } from '../utils/string'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class Simulation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      first: '',
      last: '',
      total: '',
      fgts: '',
      dataSource: ds.cloneWithRows([]),
      sumTotal: '$ 0.00'
    }
    this.firstChanged = this.firstChanged.bind(this)
    this.lastChanged = this.lastChanged.bind(this)
    this.totalChanged = this.totalChanged.bind(this)
    this.fgtsChanged = this.fgtsChanged.bind(this)
    this.simulate = this.simulate.bind(this)
  }

  firstChanged(text) {
    this.setState({ first: text })
  }

  lastChanged(text) {
    this.setState({ last: text })
  }

  totalChanged(text) {
    this.setState({ total: text })
  }

  fgtsChanged(text) {
    this.setState({ fgts: text })
  }

  simulate() {
    const first = Number(this.state.first)
    const last = Number(this.state.last)
    const nTotal = Number(this.state.total)
    const fgts = Number(this.state.fgts)

    if (!first || !last || !nTotal || first <= last)
      return

    const interest = (first - last) / nTotal

    let installments = []

    let total = 0
    let parcela = first
    const descontoFgts = fgts > 0 ? fgts / 360 : 0
    for (let i = 1; i <= nTotal; i++) {
      total += (parcela - descontoFgts)
      installments.push({
        number: i,
        value: toMoney((parcela - descontoFgts))
      })
      parcela -= interest;
    }

    this.setState({
      sumTotal: '$ ' + total.toFixed(2),
      dataSource: ds.cloneWithRows(installments)
    })
  }

  render() {
    return (
      <View style={{
        marginTop: 20,
        marginLeft: 20,
        height: 600
      }}>
        <View style={{
          width: 300,
          flexDirection: 'row',
          height: 40,
          alignItems: 'flex-start'
        }}>
          <Text>First Installment Value: </Text>
          <PatternTextInput
            style={{ width: 120, height: 40, marginTop: -8 }}
            placeholder="First"
            pattern="^[0-9]{0,4}([.][0-9]{0,2})?$"
            onChangeText={(t) => this.firstChanged(t)}
          />
        </View>
        <View style={{
          width: 300,
          flexDirection: 'row',
          height: 40,
          alignItems: 'flex-start'
        }}>
          <Text>Last Installment Value: </Text>
          <PatternTextInput
            style={{ width: 120, height: 40, marginTop: -8 }}
            placeholder="Last"
            pattern="^[0-9]{0,4}([.][0-9]{0,2})?$"
            onChangeText={(t) => this.lastChanged(t)}
          />
        </View>
        <View style={{
          width: 300,
          flexDirection: 'row',
          height: 40,
          alignItems: 'flex-start'
        }}>
          <Text>Total Installments: </Text>
          <PatternTextInput
            style={{ width: 120, height: 40, marginTop: -8 }}
            placeholder="n° Total"
            pattern="^[0-9]{0,4}?$"
            onChangeText={(t) => this.totalChanged(t)}
          />
        </View>
        <View style={{
          width: 300,
          flexDirection: 'row',
          height: 40,
          alignItems: 'flex-start'
        }}>
          <Text>Fgts: </Text>
          <PatternTextInput
            style={{ width: 120, height: 40, marginTop: -8 }}
            placeholder="Fgts"
            pattern="^[0-9]{0,6}([.][0-9]{0,2})?$"
            onChangeText={(t) => this.fgtsChanged(t)}
          />
        </View>
        <View style={{ width: 200 }}>
          <Button title="Simulate" onPress={() => this.simulate()}></Button>
        </View>

        <View style={{ width: 200, marginTop: 10 }}>
          <Text>{this.state.sumTotal}</Text>
        </View>

        <ListView
          enableEmptySections={true}
          collapsable={true}
          paddingLeft={10}
          paddingRight={10}
          marginTop={10}
          dataSource={this.state.dataSource}
          renderRow={p =>
            <Card>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                  <Text>{p.number}</Text>
                  <Text style={{ color: '#aaa', fontWeight: 'bold' }}>{p.value}</Text>
                  <Text style={{ color: '#aaa', fontWeight: 'bold' }}>{p.paid ? 'PAID' : ''}</Text>
                </View>
              </View>
            </Card>
          } />
      </View>
    )
  }
}
