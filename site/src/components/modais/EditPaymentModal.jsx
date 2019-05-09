import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
  TextField,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Checkbox,
  MenuItem,
  RadioGroup,
  Radio,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

import TextInputMask from 'react-masked-text'

import IconTextInput from '../main/IconTextInput'
import InputMoney from '../inputs/InputMoney'

import { dateToString, getDateFromStringEg, toReal, toDateFormat } from '../../helpers'
import { creditCardService, paymentService } from '../../services/index'

const styles = {
  maskInput: {
    color: '#666',
    backgroundColor: 'white',
    border: 'solid 0',
    borderBottom: 'solid 1px #666',
    margin: '10px',
    width: '100px',
    marginRight: '20px'
  }
}

export default class EditPaymentModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      payment: {},
      description: '',
      cards: [],
      paymentType: 2,
      useCreditCard: false,
      fixedPayment: false,
      qtdInstallments: 10,
      card: [],
      costByInstallment: true,
      costText: '',
      installments: [],
      firstPayment: '05/05/2018'
    }
  }

  componentDidMount() {
    creditCardService.get().then(res => this.setState({ cards: res, card: res[0] ? res[0].id : null }))
  }

  save() {
    const { installments, fixedPayment, description, firstPayment, paymentType, card, useCreditCard } = this.state

    const payment = {}
    payment.id = this.props.payment.id
    payment.description = description
    payment.type = paymentType
    payment.installments = installments
    payment.fixedPayment = fixedPayment

    if (!description || !installments.length) {
      this.setState({ errorMessage: 'Preencha corretamente os campos.' })
      return
    }

    if (useCreditCard)
      payment.creditCardId = card

    if (payment.id)
      paymentService.update(payment)
        .then(() => this.props.onFinish())
        .catch(err => this.setState({ errorMessage: err.error }))
    else
      paymentService.create(payment)
        .then(() => this.props.onFinish())
        .catch(err => this.setState({ errorMessage: err.message }))
  }

  onEnter() {
    const { description, singlePlot, firstPayment, fixedPayment, cost, type, plots, creditCardId, plotsPaid } = this.props.payment || {}
    this.setState({
      description: description || '',
      firstPayment: dateToString(firstPayment),
      cost: cost ? cost.toString() : '0',
      paymentType: type || 2,
      card: creditCardId,
      useCreditCard: creditCardId ? true : false,
      fixedPayment: fixedPayment ? true : false,
      showModal: true
    })
  }

  updateInstallments(data) {
    const { costByInstallment, qtdInstallments, costText, fixedPayment, firstPayment } = data
    const installments = []
    let cost = Number(data.costText.replace(/[^0-9,]/g, '').replace(',', '.') || 0)
    if (cost > 0 && qtdInstallments > 0 && /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(firstPayment)) {
      let day = Number(firstPayment.substr(0, 2))
      let month = Number(firstPayment.substr(3, 2))
      let year = Number(firstPayment.substr(6, 4))

      if (!fixedPayment) {
        if (costByInstallment)
          cost = cost / qtdInstallments

        for (let i = 1; i <= qtdInstallments; i++) {
          if (month > 12) {
            month = 1
            year++
          }
          installments.push({ number: i, cost: cost, date: new Date(`${month}/${day}/${year}`) })
          month++
        }
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

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => this.props.onClose()}
        onEnter={() => this.onEnter()}
        transitionDuration={300}
        TransitionComponent={Zoom}>
        <DialogTitle style={{ textAlign: 'center' }}>
          {this.props.payment.id > 0 ? 'Editar Pagamento' : 'Novo Pagamento'}
        </DialogTitle>
        <DialogContent>
          <div style={{ textAlign: 'start', color: '#666', fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"' }} >

            <IconTextInput
              label="Descrição"
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.value, errorMessage: '' })}
            />
            <FormControl style={{ width: '240px', marginLeft: '20px', marginTop: '10px' }}>
              <InputLabel htmlFor="select-tipo">Tipo</InputLabel>
              <Select
                value={this.state.paymentType || 2}
                color="red"
                onChange={e => this.setState({ paymentType: e.target.value })}>
                <MenuItem key={1} value={1}><span style={{ color: 'green', fontWeight: 'bold' }}>RENDA</span></MenuItem>
                <MenuItem key={2} value={2}><span style={{ color: 'red', fontWeight: 'bold' }}>DESPESA</span></MenuItem>
              </Select>
            </FormControl>

            <div style={{ marginRight: '10px', marginTop: '10px', color: '#666' }}>
              <span>Valor:</span>
              <TextInputMask
                onChangeText={e => this.updateInstallments({ ...this.state, costText: e })}
                kind="money"
                value={this.state.costText}
                style={styles.maskInput} />
              <span>Data:</span>
              <TextInputMask
                onChangeText={e => this.updateInstallments({ ...this.state, firstPayment: e })}
                kind="datetime"
                value={this.state.firstPayment}
                options={{ format: 'dd/MM/YYYY' }}
                style={styles.maskInput} />
              <FormControlLabel label="Pagamento Fixo ?"
                control={<Checkbox
                  checked={this.state.fixedPayment}
                  onChange={(e, c) => this.updateInstallments({ ...this.state, fixedPayment: c })}
                  color="primary"
                />} />
            </div>

            <div hidden={!this.state.cards.length}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.useCreditCard}
                    onChange={(e, c) => this.setState({ useCreditCard: c, card: this.state.cards[0].id })}
                    color="primary"
                  />
                }
                label="Cartão de crédito"
              />
              {
                this.state.cards.length && this.state.useCreditCard ?
                  <FormControl style={{ marginLeft: '20px' }}>
                    <InputLabel htmlFor="select-tipo">Cartão de crédito</InputLabel>
                    <Select style={{ width: '200px' }} value={this.state.card}
                      onChange={e => this.setState({ card: e.target.value })}>
                      {this.state.cards.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  : null
              }
            </div>

            <div hidden={this.state.fixedPayment} style={{ color: '#666' }}>
              <FormControlLabel label="Valor por parcela"
                control={<Checkbox
                  checked={this.state.costByInstallment}
                  onChange={(e, c) => this.updateInstallments({ ...this.state, costByInstallment: c })}
                  color="primary"
                />} />
              <span>Qtd. Parcelas:</span>
              <TextInputMask
                onChangeText={e => this.updateInstallments({ ...this.state, qtdInstallments: e })}
                kind="only-numbers"
                value={this.state.qtdInstallments}
                style={styles.maskInput} />
            </div>



            <div hidden={!this.state.installments.length || this.state.fixedPayment}
              style={{ textAlign: 'center', marginTop: '20px' }}>
              <fieldset style={{ borderColor: '#ddd' }}>
                <legend style={{ fontSize: '16px' }}>PARCELAS</legend>
                <List component="nav">
                  {this.state.installments.map((p, i) =>
                    <ListItem style={{ padding: '0px', color: '#666', borderBottom: '1px solid #666' }} key={i}>
                      <ListItemText primary={p.number}></ListItemText>
                      <ListItemText primary={toReal(p.cost)}></ListItemText>
                      <ListItemText primary={toDateFormat(p.date, 'dd/MM/yyyy')}></ListItemText>
                    </ListItem>
                  )}

                </List>
              </fieldset>
            </div>
            <div style={{ textAlign: 'center', color: '#d55', marginTop: '20px' }}>
              <span style={{}}>{this.state.errorMessage}</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClose()} variant="raised" autoFocus>cancelar</Button>
          <Button onClick={() => this.save()} color="primary" variant="raised" autoFocus>salvar</Button>
        </DialogActions>
      </Dialog>
    )
  }
}