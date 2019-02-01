import React, { Component } from 'react'
import { ActivityIndicator, Text, Button, Picker, View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Checkbox } from 'react-native-material-ui'

import { PaymentType } from '../utils/constants'
import { CreditCardService, PaymentService } from '../services'
import { fromReal, onlyInteger, fromMoneyString, toReal, generatePickerMonthYear } from '../utils/string'

const styles = {
  input: {
    width: 200,
    borderColor: '#000',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  }
}

export default class NewPayment extends Component {

  constructor(props) {
    super(props)
    const p = props.payment || { type: PaymentType.Expense }
    const now = new Date()

    const date = (p.firstPayment || `01/01/${now.getFullYear()}`).split('/')

    this.state = {
      id: p.id,
      description: p.description,
      cost: toReal(p.cost ? p.cost : '0'),
      type: p.type || PaymentType.Expense,
      date: `${date[1]}/${date[2]}`,
      error: '',
      plots: p.plots ? p.plots + '' : '',
      plotsPaid: p.plotsPaid ? p.plotsPaid + '' : '',
      singlePlot: p.singlePlot,
      fixedPayment: p.fixedPayment,
      useCreditCard: false,
      cards: [],
      card: p.creditCard || {},
      loading: true,
      monthsYearsPicker: generatePickerMonthYear('01/' + (now.getFullYear() - 1), 5)
    }
  }

  componentDidMount() {
    CreditCardService.get()
      .then(res => this.setState({ cards: res, loading: false }))
      .catch(err => this.setState({ error: err.message, loading: false }))
  }

  save() {

    const { id, description, cost, type, date, plots, plotsPaid, singlePlot, fixedPayment, useCreditCard, card } = this.state

    const arrDate = date.split('/')
    const firstPayment = `${arrDate[0]}/01/${arrDate[1]}`

    const payment = {
      id,
      description,
      type,
      plots: !fixedPayment && !singlePlot ? plots : 0,
      plotsPaid: !fixedPayment && !singlePlot ? plotsPaid : 0,
      firstPayment: firstPayment,
      fixedPayment,
      singlePlot: !fixedPayment && singlePlot ? true : false,
      cost: fromReal(cost),
      creditCardId: useCreditCard ? card.id : null
    }

    this.setState({ loading: true })

    PaymentService.save(payment)
      .then(res => {
        console.warn('sucesso')
        setTimeout(() => { Actions.refresh({ refreshPayments: true }) }, 500)
        Actions.pop()
      })
      .catch(err => {
        console.warn(err)
        this.setState({ loading: false, error: err.message })

      })
  }

  render() {
    return (
      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        {this.state.loading ? <ActivityIndicator size="large" /> : null}
        <TextInput
          onChangeText={t => this.setState({ error: '', description: t })}
          value={this.state.description}
          placeholder="Descrição"
          style={styles.input}
        />
        <View style={{ marginTop: 20 }} width={200} height={30}>
          <Checkbox onCheck={(checked) => this.setState({ singlePlot: checked })} label="Parcela única ?" value="agree" checked={this.state.singlePlot} />
        </View>

        {this.state.singlePlot ? null :
          <View style={{ marginTop: 20 }} width={200} height={30}>
            <Checkbox onCheck={(checked) => this.setState({ fixedPayment: checked })} label="Mensal ?" value="agree" checked={this.state.fixedPayment} />
          </View>
        }

        {this.state.cards.length ?
          <View>
            <View style={{ marginTop: 20 }} width={200} height={30}>
              <Checkbox onCheck={(checked) => this.setState({ useCreditCard: checked })} label="Cartão de Crédito ?" value="agree" checked={this.state.useCreditCard} />
            </View>

            {this.state.useCreditCard ?
              <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
                <Picker
                  selectedValue={this.state.card}
                  style={{ height: 50, width: 200 }}
                  onValueChange={(itemValue, index) => this.setState({ error: '', card: itemValue })}>
                  {this.state.cards.map(c => <Picker.Item key={c.id} label={c.name} value={c} />)}
                </Picker>
              </View>
              : null}

          </View>
          : null}

        {this.state.fixedPayment || this.state.singlePlot
          ? null :
          <View>
            <TextInput
              onChangeText={t => this.setState({ error: '', plots: onlyInteger(t) })}
              value={this.state.plots}
              placeholder="N° de parcelas"
              style={styles.input}
            />

            <TextInput
              onChangeText={t => this.setState({ error: '', plotsPaid: onlyInteger(t) })}
              value={this.state.plotsPaid}
              placeholder="Nº de parcelas pagas"
              style={styles.input}
            />
          </View>
        }

        <TextInput
          onChangeText={t => this.setState({ error: '', cost: t ? fromMoneyString(t) : '' })}
          onBlur={t => this.setState({ cost: this.state.cost ? toReal(this.state.cost) : '' })}
          value={this.state.cost}
          placeholder="Valor Total"
          style={styles.input}
        />

        <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
          <Picker
            selectedValue={this.state.type}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, index) => this.setState({ error: '', type: itemValue })}>
            <Picker.Item label="Despesa" value={PaymentType.Expense} />
            <Picker.Item label="Renda" value={PaymentType.Income} />
          </Picker>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ marginRight: 10 }}>Primeiro Pagamento:</Text>
          <Picker
            mode="dropdown"
            selectedValue={this.state.date}
            style={{ height: 50, width: 140, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
            onValueChange={date => this.setState({ date: date })}>
            {this.state.monthsYearsPicker.map((p, i) => <Picker.Item key={i} label={p} value={p} />)}
          </Picker>
        </View>
        <View style={{ marginTop: 20, justifyContent: 'space-between' }} width={200}>
          <Button disabled={this.state.loading} onPress={() => this.save()} raised={true} color='#282' title='Save' />
        </View>
        <Text style={{ color: '#F33' }}>{this.state.error}</Text>
      </View>
    )
  }
}