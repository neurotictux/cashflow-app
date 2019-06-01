import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator, Text, Button, Picker, View, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Checkbox } from 'react-native-material-ui'
import { TextInputMask } from 'react-native-masked-text'
import { withFormik } from 'formik'
import { object, string, number } from 'yup'

import { PaymentType } from '../utils/constants'
import { validatePayment } from '../validations/payment'
import { creditCardStorage, paymentStorage } from '../storage'
import { fromReal, onlyInteger, toReal, generatePickerMonthYear } from '../utils/string'

import { PaymentService } from 'cashflow-cross-cutting'

import { ErrorForm } from '../components'

const styles = {
  input: {
    width: 200,
    borderColor: '#000',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  }
}

class FormNewPayment extends Component {

  constructor(props) {
    super(props)
    const now = new Date()
    const p = props.payment || { type: PaymentType.Expense }
    this.state = {
      description: p.description || '',
      cost: toReal(0),
      qtdInstallments: '',
      payment: {},
      cards: [],
      type: p.type || PaymentType.Expense,
      paymentType: 2,
      useCreditCard: false,
      fixedPayment: false,
      error: '',
      card: [],
      costByInstallment: true,
      costText: '',
      installments: [],
      firstPayment: '',
      loading: false,
      paidInstallments: [],
      monthsYearsPicker: generatePickerMonthYear('01/' + (now.getFullYear() - 1), 5)
    }
  }

  componentDidMount() {

    creditCardStorage.getAll().then(cards => {
      this.setState({ cards })
    })

    const {
      description,
      installments,
      fixedPayment,
      type,
      creditCardId,
      invoice
    } = this.props.payment || {}

    const firstInstallment = (installments || [])[0] || {}
    const qtdInstallments = (installments || []).length || 1
    const costs = (installments || []).map(p => p.cost)
    const paidInstallments = (installments || []).filter(p => p.paid).map(p => p.number)

    this.setState({
      useCreditCard: creditCardId > 0,
      description: description || '',
      paymentType: type || 2,
      card: creditCardId,
      showModal: true,
      paidInstallments,
      invoice
    })

    this.updateInstallments({
      costByInstallment: false,
      qtdInstallments,
      costText: toReal(costs.length ? costs.reduce((a, b) => a + b) : 0),
      fixedPayment,
      paidInstallments,
      // firstPayment: dateToString(firstInstallment.date ? new Date(firstInstallment.date) : null),
    })
  }

  updateInstallments(data) {
    const { payment, paidInstallments, costByInstallment, qtdInstallments, costText, fixedPayment, firstPayment } = data
    const installments = []
    let cost = Number((costText || '').replace(/[^0-9,]/g, '').replace(',', '.') || 0)
    if (cost > 0 && qtdInstallments > 0 && /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(firstPayment)) {
      let day = Number(firstPayment.substr(0, 2))
      let month = Number(firstPayment.substr(3, 2))
      let year = Number(firstPayment.substr(6, 4))

      if (!fixedPayment) {
        let firstCost = cost
        if (!costByInstallment) {
          const total = cost
          cost = parseFloat(Number(cost / qtdInstallments).toFixed(2))
          const sum = parseFloat(Number(cost * qtdInstallments).toFixed(2))
          firstCost = cost + (total > sum ? total - sum : sum - total)
        }

        for (let i = 1; i <= qtdInstallments; i++) {
          if (month > 12) {
            month = 1
            year++
          }
          installments.push({
            number: i,
            cost: cost,
            date: new Date(`${month}/${day}/${year}`),
            paid: paidInstallments.indexOf(i) !== -1
          })
          month++
        }
        installments[0].cost = firstCost
      }
      else
        installments.push({ number: 1, cost: cost, date: new Date(`${month}/${day}/${year}`) })
    }

    this.setState({
      costByInstallment,
      qtdInstallments,
      costText,
      firstPayment,
      installments,
      fixedPayment,
      errorMessage: ''
    })
  }

  paidChanged(installment, paid) {
    installment.paid = paid
    this.setState({ installments: this.state.installments })
  }

  save() {
    const { invoice, installments, fixedPayment, description, paymentType, card, useCreditCard } = this.state
    // const { description, installments, fixedPayment, type } = payment
    const payment = {}
    payment.id = this.props.payment.id
    payment.description = description
    payment.type = paymentType
    payment.installments = installments
    payment.fixedPayment = fixedPayment
    payment.invoice = invoice

    if (!description || !installments.length) {
      this.setState({ errorMessage: 'Preencha corretamente os campos.' })
      return
    }

    if (useCreditCard)
      payment.creditCard = { id: card }

    this.setState({ loading: true })

    if (payment.id)
      paymentService.update(payment)
        .then(() => this.props.onFinish())
        .catch(err => this.setState({ loading: false, errorMessage: err.error }))
    else
      paymentService.create(payment)
        .then(() => this.props.onFinish())
        .catch(err => this.setState({ loading: false, errorMessage: err.message }))
  }

  render() {
    const { touched, errors, setFieldValue } = this.props
    return (
      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        {this.state.loading ? <ActivityIndicator size="large" /> : null}
        <TextInput
          onChangeText={t => this.props.setFieldValue('description', t)}
          value={this.props.description}
          placeholder="Descrição"
          style={styles.input}
        />

        <ErrorForm touched={touched.description} text={errors.description} />

        <View style={{ marginTop: 20 }} width={200} height={30}>
          <Checkbox onCheck={checked => this.setState({ fixedPayment: checked })} label="Mensal Fixo ?" value="agree" checked={this.state.fixedPayment} />
        </View>

        <TextInputMask type="money"
          value={this.state.cost}
          style={styles.input}
          options={{ unit: 'R$ ' }}
          onChangeText={t => { this.setState({ cost: t }); setFieldValue('cost', fromReal(t) || '') }} />

        <ErrorForm touched={touched.cost} text={errors.cost} />

        {this.state.fixedPayment ? null :
          <TextInput
            onChangeText={t => setFieldValue('qtdInstallments', onlyInteger(t) || '')}
            value={this.props.qtdInstallments}
            placeholder="N° de parcelas"
            style={styles.input}
          />
        }

        <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
          <Picker
            selectedValue={this.state.type}
            style={{ height: 50, width: 200 }}
            onValueChange={itemValue => this.setState({ error: '', type: itemValue })}>
            <Picker.Item color="red" label="Despesa" value={PaymentType.Expense} />
            <Picker.Item color="green" label="Renda" value={PaymentType.Income} />
          </Picker>
        </View>

        {this.state.cards.length ?
          <View>
            <View style={{ marginTop: 20 }} width={200} height={30}>
              <Checkbox onCheck={checked => this.setState({ useCreditCard: checked })} label="Cartão de Crédito ?" value="agree" checked={this.state.useCreditCard} />
            </View>

            {this.state.useCreditCard ?
              <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
                <Picker
                  selectedValue={this.state.card}
                  style={{ height: 50, width: 200 }}
                  onValueChange={itemValue => this.setState({ error: '', card: itemValue })}>
                  {this.state.cards.map(c => <Picker.Item key={c.id} label={c.name} value={c} />)}
                </Picker>
              </View>
              : null}

          </View>
          : null}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ marginRight: 10 }}>Data:</Text>
          <Picker
            mode="dropdown"
            selectedValue={this.state.date}
            style={{ height: 50, width: 140, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
            onValueChange={date => this.setState({ date: date })}>
            {this.state.monthsYearsPicker.map((p, i) => <Picker.Item key={i} label={p} value={p} />)}
          </Picker>
        </View>
        <View style={{ marginTop: 20, justifyContent: 'space-between' }} width={200}>
          <Button disabled={this.state.loading} onPress={() => this.props.handleSubmit()} raised={true} color='#282' title='Save' />
        </View>
        <Text style={{ color: '#F33' }}>{this.state.error}</Text>
      </View>
    )
  }
}

FormNewPayment.propTypes = {
  payment: PropTypes.object
}

export default withFormik({
  mapPropsToValues: () => ({ cost: '', description: '', qtdInstallments: '' }),
  handleSubmit: (values) => console.log(values),
  validateOnChange: true,
  validationSchema: object().shape({
    description: string().required('Informe a descrição'),
    cost: string().required('Informe o valor'),
    qtdInstallments: string().required('Informe o valor')
  })
})(FormNewPayment)