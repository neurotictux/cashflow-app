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
  MenuItem
} from '@material-ui/core'

import IconTextInput from '../main/IconTextInput'
import { getDateStringEg, getDateFromStringEg } from '../../helpers/utils'
import { creditCardService, paymentService } from '../../services/index'

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
      singlePlot: false,
      card: [],
      firstPayment: getDateStringEg(new Date())
    }
  }

  componentDidMount() {
    creditCardService.get().then(res => this.setState({ cards: res, card: res[0] ? res[0].id : null }))
  }

  save() {
    const { singlePlot, fixedPayment, description, firstPayment, cost, paymentType, plots, card, useCreditCard, plotsPaid } = this.state

    const payment = {}
    payment.id = this.props.payment.id
    payment.description = description
    payment.firstPayment = getDateFromStringEg(firstPayment)
    payment.cost = cost ? Number(cost) : 0
    payment.singlePlot = singlePlot
    payment.type = paymentType
    if (!singlePlot) {
      payment.fixedPayment = fixedPayment
      payment.plots = plots && !fixedPayment ? Number(plots) : 0
      payment.plotsPaid = plotsPaid && !fixedPayment ? Number(plotsPaid) : 0
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
        .catch(err => this.setState({ errorMessage: err.error }))
  }

  onEnter() {
    const { description, singlePlot, firstPayment, fixedPayment, cost, type, plots, creditCardId, plotsPaid } = this.props.payment || {}
    this.setState({
      description: description || '',
      firstPayment: getDateStringEg(firstPayment ? new Date(firstPayment) : new Date()),
      cost: cost ? cost.toString() : '0',
      paymentType: type || 2,
      plots: plots ? plots.toString() : '1',
      card: creditCardId,
      useCreditCard: creditCardId ? true : false,
      plotsPaid: plotsPaid ? plotsPaid.toString() : '0',
      fixedPayment: fixedPayment ? true : false,
      showModal: true,
      singlePlot: singlePlot ? true : false,
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
          {this.props.payment.id > 0 ? 'Edição' : 'Novo'}</DialogTitle>
        <DialogContent>
          <div style={{ textAlign: 'center' }} >

            <IconTextInput
              label="Descrição"
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.value, errorMessage: '' })}
            />
            <FormControl style={{ marginLeft: '20px', marginTop: '10px' }}>
              <InputLabel htmlFor="select-tipo">Tipo</InputLabel>
              <Select
                value={this.state.paymentType}
                onChange={(e) => this.setState({ paymentType: e.target.value })}>
                <MenuItem key={1} value={1}>Renda</MenuItem>
                <MenuItem key={2} value={2}>Despesa</MenuItem>
              </Select>
            </FormControl>
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.singlePlot}
                  onChange={(e, c) => this.setState({ singlePlot: c })}
                  color="primary"
                />
              }
              label="Parcela única ?"
            />
            <br />
            <div hidden={this.state.singlePlot}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.fixedPayment}
                    onChange={(e, c) => this.setState({ fixedPayment: c })}
                    color="primary"
                  />
                }
                label="Fixo mensal ?"
              />
              <br />
              <div hidden={this.state.fixedPayment}>
                <IconTextInput
                  label="Quantidade de Parcelas"
                  value={this.state.plots}
                  type="number"
                  onChange={(e) => this.setState({ plots: e.value.replace('.', ''), errorMessage: '' })}
                />
                <IconTextInput style={{ marginLeft: '10px' }}
                  label="Parcelas Pagas"
                  value={this.state.plotsPaid}
                  type="number"
                  onChange={(e) => this.setState({ plotsPaid: e.value.replace('.', ''), errorMessage: '' })}
                />
              </div>
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
                label="Cartão de crédito ?"
              />
            </div>
            {
              this.state.cards.length && this.state.useCreditCard ?
                <FormControl style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <InputLabel htmlFor="select-tipo">Cartão de crédito</InputLabel>
                  <Select style={{ width: '200px' }} value={this.state.card}
                    onChange={(e) => this.setState({ card: e.target.value })}>
                    {this.state.cards.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
                : null
            }

            <div>
              <IconTextInput
                label="Valor Total"
                value={this.state.cost}
                type="number"
                onChange={(e) => this.setState({ cost: e.value, errorMessage: '' })}
              />
              <TextField style={{ marginLeft: '10px', marginTop: '10px' }}
                id="date"
                label="Primeiro Pagamento"
                type="month"
                onChange={(e) => this.setState({ firstPayment: e.target.value })}
                defaultValue={this.state.firstPayment}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <span style={{ color: '#d55', marginTop: '10px' }}>{this.state.errorMessage}</span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClose()} variant="raised" autoFocus>cancelar</Button>
          <Button onClick={() => this.save()} color="primary" variant="raised" autoFocus>Salvar</Button>
        </DialogActions>
      </Dialog>
    )
  }
}