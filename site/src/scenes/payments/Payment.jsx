import React from 'react'

import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  ListItemText,
  Tooltip,
  Button,
  Typography
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import CardIcon from '@material-ui/icons/CreditCardOutlined'

import CardMain from '../../components/main/CardMain'
import InputMoney from '../../components/inputs/InputMoney'
import EditPaymentModal from '../../components/modais/EditPaymentModal'
import { paymentService, creditCardService } from '../../services/index'
import { toReal, dateToString } from '../../helpers'
import IconTextInput from '../../components/main/IconTextInput'

const styles = {
  noRecords: {
    textTransform: 'none',
    fontSize: '18px',
    textAlign: 'center'
  },
  divNewPayment: {
    textTransform: 'none',
    fontSize: '18px',
    textAlign: 'center',
    marginTop: '20px'
  },
  errorMessage: {
    color: 'red'
  }
}

const CreditCardComponent = props => {
  if (!props.card)
    return null
  return (
    <span>
      <br />
      <CardIcon />
      <span style={{ marginTop: '-20px' }}>{props.card.name}</span>
    </span>
  )
}

export default class Payment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      cards: [],
      payment: {},
      payments: [],
      paymentType: 2,
      useCreditCard: false,
      fixedPayment: false,
      card: null,
      showModal: false,
      filtro: ''
    }
  }

  componentDidMount() {
    this.refresh()
    creditCardService.get().then(res => this.setState({ cards: res }))
  }

  refresh() {
    this.setState({ loading: true, errorMessage: '' })
    paymentService.get().then(res => {
      setTimeout(() => {
        this.setState({
          loading: false,
          payments: res,
          filtro: '',
          filteredPayments: res
        })
      }, 300)
    })
  }

  removePayment(id) {
    paymentService.remove(id)
      .then(() => this.refresh())
      .catch(err => this.setState({ errorMessage: err.error }))
  }

  openEditNew(p) {
    const { description, firstPayment, fixedPayment, cost, type, creditCardId } = p || {}
    this.setState({
      payment: p || {},
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

  onFinish() {
    this.setState({ showModal: false })
    this.refresh()
  }

  render() {
    const { payments, filtro } = this.state
    return (
      <CardMain title="Pagamentos" loading={this.state.loading}>
        {payments.length ?
          <div>
            <div style={styles.divNewPayment}>
              <Button variant="raised" color="primary" onClick={() => this.openEditNew()}>
                Adicionar Pagamento
              </Button>
            </div>
            <Paper style={{ marginTop: '20px' }}>

              <div style={{ textAlign: 'center' }}>
                <IconTextInput
                  label="Filtro"
                  onChange={e => this.setState({ filtro: e.value.toUpperCase() })}
                />
              </div>

              <List dense={true}>
                {payments.filter(p => !filtro || !p.description || p.description.toUpperCase().indexOf(filtro) !== -1).map(p =>
                  <ListItem button key={p.id}
                    onClick={() => this.openEditNew(p)}>
                    <ListItemAvatar>
                      <Avatar>
                        <CardIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={p.description}
                      style={{ width: '200px' }}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" color={p.type === 1 ? 'primary' : 'secondary'}>
                            {p.type === 1 ? 'Renda' : 'Despesa'}
                          </Typography>
                          {p.firstPaymentFormatted}
                        </React.Fragment>
                      }
                    />
                    <ListItemText
                      primary={toReal(p.cost)}
                      style={{ width: '200px' }}
                      secondary={
                        <React.Fragment>
                          {p.fixedPayment ? 'Fixo Mensal' : `${p.installments.filter(p => p.paid).length}/${p.installments.length}`}
                          <CreditCardComponent card={p.creditCard} />
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Remover este pagamento">
                        <IconButton color="secondary" aria-label="Delete"
                          onClick={() => this.removePayment(p.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </Paper>
          </div>
          :
          <div style={styles.noRecords}>
            <div>
              <span>Você não possui pagamentos cadastrados.</span>
            </div>

            <div>
              <InputMoney label="Valor"></InputMoney>
            </div>
          </div>
        }
        <div style={styles.divNewPayment}>
          <Button variant="raised" color="primary" onClick={() => this.openEditNew()}>
            Adicionar Pagamento
          </Button>
        </div>
        {
          this.state.showModal ?
            <EditPaymentModal
              onFinish={() => this.onFinish()}
              cards={this.state.cards}
              open={this.state.showModal}
              payment={this.state.payment}
              onClose={() => this.setState({ showModal: false })} />
            : null
        }
      </CardMain>
    )
  }
}