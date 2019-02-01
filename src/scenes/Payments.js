import React, { Component } from 'react'
import { TouchableOpacity, Alert, FlatList, StyleSheet, } from 'react-native'
import { Card } from 'react-native-material-ui'
import { Actions } from 'react-native-router-flux'
import ActionButton from 'react-native-action-button'

import { PaymentListItem, BaseViewComponent } from '../components'
import { PaymentService } from '../services'

export default class Payments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sum: '$ 0.00',
      color: 'green',
      modalVisible: true,
      payments: [],
      loading: true
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    this.setState({ loading: true })
    PaymentService.get()
      .then(res => {
        this.setState({
          payments: res.map((p, i) => ({ key: i + '', value: p })),
          loading: false
        })
      })
      .catch(err => {
        this.setState({ loading: false })
        console.warn(err)
      })
  }

  menuSelected(index) {
    switch (index) {
      case 0:
        this.refresh()
        break
    }
  }

  removePayment(p) {
    PaymentService.remove(p.id)
      .then(() => this.refresh())
      .catch(err => console.warn(err))
  }

  openDialog(p) {
    Alert.alert(
      'Excluir pagamento selecionado?',
      `'${p.description}'`,
      [
        { text: 'Editar', onPress: () => Actions.newPayment({ payment: p, title: 'Editar Pagamento' }) },
        {
          text: 'Não',
          style: 'cancel',
        },
        { text: 'Sim', onPress: () => this.removePayment(p) },
      ],
      { cancelable: false },
    );
  }

  componentWillReceiveProps(props) {
    if (props.refreshPayments)
      this.refresh()
  }

  render() {
    return (
      <BaseViewComponent
        title="Pagamentos"
        menuSelected={index => this.menuSelected(index)}
        loading={this.state.loading}>

        <FlatList
          style={{ height: '100%' }}
          data={this.state.payments}
          renderItem={({ item }) =>
            <TouchableOpacity delayLongPress={500}
              onPress={() => Actions.newPayment({ payment: item.value, title: 'Editar Pagamento' })}
              onLongPress={() => this.openDialog(item.value)}>
              <Card >
                <PaymentListItem payment={item.value} />
              </Card>
            </TouchableOpacity>}
        />

        <ActionButton onPress={() => Actions.newPayment({ payment: {}, title: 'Novo Pagamento' })} offsetX={10} offsetY={10} buttonColor="#282" />
      </BaseViewComponent>

    )
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})