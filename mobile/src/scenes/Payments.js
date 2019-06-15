import React, { Component } from 'react'
import { TouchableOpacity, Alert, FlatList } from 'react-native'
import { Card } from 'react-native-material-ui'
import { Actions } from 'react-native-router-flux'
import ActionButton from 'react-native-action-button'
import { PaymentService } from 'cashflow-cross-cutting'

import { paymentStorage, creditCardStorage } from '../storage'
import { PaymentListItem, BaseViewComponent } from '../components'
import { paymentService } from '../services'

export default class Payments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payments: [],
      filteredPayments: [],
      loading: false
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh() {
    this.setState({ loading: true })
    paymentService.get()
      .then(res => {
        this.setState({
          payments: res,
          filteredPayments: res.map((p, i) => ({ key: i + '', value: p })),
          loading: false
        })
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
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
    paymentService.remove(p.id)
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
    )
  }

  filter(text) {
    let filtered = null
    if (text)
      filtered = this.state.payments.filter(p => p.description.toUpperCase().includes(text.toUpperCase()))
    else
      filtered = this.state.payments
    this.setState({
      filteredPayments: filtered.map((p, i) => ({ key: i + '', value: p }))
    })
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
        loading={this.state.loading}
        onSearchChanged={(val) => this.filter(val)}
        onSearchClosed={() => this.filter()}>
        <FlatList
          style={{ height: '100%' }}
          data={this.state.filteredPayments}
          renderItem={({ item }) =>
            <TouchableOpacity delayLongPress={500}
              onPress={() => Actions.newPayment({ payment: item.value, title: 'Editar Pagamento' })}
              onLongPress={() => this.openDialog(item.value)}>
              <Card>
                <PaymentListItem payment={item.value} />
              </Card>
            </TouchableOpacity>}
        />

        <ActionButton
          onPress={() => Actions.newPayment({
            payment: {},
            title: 'Novo Pagamento'
          })} offsetX={10} offsetY={10} buttonColor="#282" />
      </BaseViewComponent>

    )
  }
}
