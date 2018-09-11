import React, { Component } from 'react'
import { Button, ListView, View, Text } from 'react-native'
import { Toolbar, Card, ActionButton } from 'react-native-material-ui'
import { toMoney } from '../utils/string'


const payments = [
  { description: 'Renner', cost: 356.98, type: 'LOSS' },
  { description: 'Salary', cost: 1387.91, type: 'GAIN' }
]

export class Payments extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: ds.cloneWithRows(payments),
    }
  }

  render() {
    return (
      <View>
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
              labels: ["item 1", "item 2"]
            }
          }}
          onRightElementPress={(label) => { console.warn(label) }}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={p =>
            <Card>
              <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text>{p.description}</Text>
                  <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>{toMoney(p.cost)}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Button title="Editar" />
                  <View style={{ marginLeft: 4 }}>
                    <Button title="Remover" color="#F00" />
                  </View>
                </View>
              </View>
            </Card>
          }
        />
      </View>)
  }
}