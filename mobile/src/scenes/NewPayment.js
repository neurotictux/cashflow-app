import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Platform, ActivityIndicator, KeyboardAvoidingView,
  Text, Button, Picker, View, TextInput
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Checkbox, Card } from 'react-native-material-ui'
import { TextInputMask } from 'react-native-masked-text'
import { withFormik } from 'formik'
import { object, string, number } from 'yup'

import { PaymentType } from '../utils/constants'
import { fromReal, onlyInteger, toDateFormat, generatePickerMonthYear } from '../utils/string'


import { creditCardService, paymentService } from '../services'

import { ErrorForm, TextInputLayout } from '../components'

const styles = {
  input: {
    width: 200,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    fontSize: 20,
    padding: 3,
    margin: 0
  }
}, REQUIRED_FIELD = 'Campo obrigatório'

class FormNewPayment extends Component {

  constructor(props) {
    super(props)
    const now = new Date()
    this.state = {
      cards: [],
      firstPayment: '',
      loading: false,
      costText: props.values.cost || 0,
      monthsYearsPicker: generatePickerMonthYear('01/' + (now.getFullYear() - 1), 5)
    }
  }

  componentDidMount() {
    creditCardService.get()
      .then(cards => this.setState({ cards }))
      .catch(err => console.warn(err))
  }

  render() {
    const { touched, errors, values, setFieldValue } = this.props
    return (
      <Card style={{ flex: 1 }}>
        <KeyboardAvoidingView enabled
          behavior={Platform.select({
            ios: 'padding',
            android: null,
          })}
          style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between' }}>
          {this.state.loading ? <ActivityIndicator size="large" /> : null}

          <TextInputLayout label="Descrição"
            error={errors.description}
            value={values.description}
            touched={touched.description}
            onChangeText={t => setFieldValue('description', t)} />

          <View width={200} height={30} style={{ backgroundColor: 'white' }}>
            <Checkbox
              label="Mensal Fixo ?"
              value="agree"
              checked={values.fixedPayment}
              onCheck={checked => setFieldValue('fixedPayment', checked)} />
          </View>

          <TextInputMask type="money"
            value={this.state.costText}
            style={styles.input}
            options={{ unit: 'R$ ' }}
            onChangeText={t => { this.setState({ costText: t }); setFieldValue('cost', fromReal(t)) }} />

          <ErrorForm touched={touched.cost} text={errors.cost} />

          {values.fixedPayment ? null :
            <>
              <TextInput
                onChangeText={t => setFieldValue('qtdInstallments', onlyInteger(t) || '')}
                value={values.qtdInstallments}
                placeholder="N° de parcelas"
                style={styles.input}
              />
              <ErrorForm touched={touched.qtdInstallments} text={errors.qtdInstallments} />
            </>
          }

          <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
            <Picker
              selectedValue={values.type}
              style={{ height: 50, width: 200 }}
              onValueChange={itemValue => setFieldValue('type', itemValue)}>
              <Picker.Item color="red" label="DESPESA" value={PaymentType.Expense} />
              <Picker.Item color="green" label="RENDA" value={PaymentType.Income} />
            </Picker>
          </View>

          {this.state.cards.length ?
            <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
              <Picker
                selectedValue={values.card}
                style={{ height: 50, width: 200 }}
                onValueChange={itemValue => setFieldValue('card', itemValue)}>
                <Picker.Item label="SELECIONE ..." value={{ id: 0 }} />
                {this.state.cards.map(c => <Picker.Item key={c.id} label={c.name} value={c} />)}
              </Picker>
            </View>
            : null}

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ marginRight: 10 }}>DATA:</Text>
            <Picker
              mode="dropdown"
              selectedValue={values.date}
              style={{ height: 50, width: 140, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
              onValueChange={date => setFieldValue('date', date)}>
              {this.state.monthsYearsPicker.map((p, i) => <Picker.Item key={i} label={p} value={p} />)}
            </Picker>
          </View>
          <View style={{ marginTop: 20, justifyContent: 'space-between' }} width={200}>
            <Button disabled={this.state.loading} onPress={() => this.props.handleSubmit()} raised={true} color='#282' title='Save' />
          </View>
          <Text style={{ color: '#F33' }}>{this.state.error}</Text>
        </KeyboardAvoidingView>
      </Card>
    )
  }
}

FormNewPayment.propTypes = {
  payment: PropTypes.object
}

export default withFormik({
  mapPropsToValues: ({ payment }) => {
    const installments = payment.installments || []
    const date = installments[0] ? installments[0].date : new Date()
    return {
      cost: payment.cost || 0,
      description: payment.description || '',
      type: payment.type || PaymentType.Expense,
      installments: installments,
      qtdInstallments: (installments.length || '') + '',
      useCreditCard: payment.creditCardId,
      fixedPayment: payment.fixedPayment,
      date: toDateFormat(date, 'MM/yyyy')
    }
  },
  handleSubmit: values => {
    const monthYear = values.date.split('/')
    let month = Number(monthYear[0])
    let year = Number(monthYear[1])
    values.installments = []
    values.qtdInstallments = values.fixedPayment ? 1 : values.qtdInstallments || 1
    for (let i = 1; i <= values.qtdInstallments; i++) {
      values.installments.push({
        number: i,
        cost: values.cost,
        date: new Date(`${month}/01/${year}`)
      })
      month++
      if (month > 12) {
        year++
        month = 1
      }
    }
    console.log(values)
  },
  validateOnChange: true,
  validationSchema: object().shape({
    description: string().required(REQUIRED_FIELD),
    cost: number().test('len', 'Informe um valor maior que zero', (val) => {
      return val > 0
    }).required(REQUIRED_FIELD),
    qtdInstallments: string().test('len', 'Informe um valor entre 1 e 48', (val) => {
      return val > 0 && val <= 48
    }).required(REQUIRED_FIELD),
    date: string().required(REQUIRED_FIELD)
  })
})(FormNewPayment)