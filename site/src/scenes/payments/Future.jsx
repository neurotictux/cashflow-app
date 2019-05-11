import React from 'react'

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  GridList,
  GridListTile
} from '@material-ui/core'
import CardIcon from '@material-ui/icons/CreditCardOutlined'

import CardMain from '../../components/main/CardMain'
import InputMonth from '../../components/inputs/InputMonth'

import { paymentService } from '../../services/index'

import { toReal, getMonthYear } from '../../helpers/utils'
import { Colors } from '../../helpers/themes'

const styles = {
  title: {

  }
}

class Invoices extends React.Component {
  constructor(props) {
    super(props)
    const cards = []
    props.payments.forEach(p => {
      if (p.creditCard && !cards.find(x => x.id === p.creditCard))
        cards.push(p.creditCard)
    })
    cards.forEach(p => {
      p.payments = props.payments.filter(x => x.creditCard && x.creditCard.id === p.id)
    })
    this.state = { showing: false, cards }
  }

  render() {
    const { cards, showing } = this.state
    return (
      <div style={{ marginLeft: '50px', color: '#666' }}>
        <span onClick={() => this.setState({ showing: !this.state.showing })}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}>FATURAS</span>
        <div hidden={!showing} style={{ marginLeft: '50px' }}>
          {cards.map((c, j) =>
            <div key={j}>
              <span>{c.name}</span>
              <List dense={true} style={{ marginLeft: '50px' }}>
                {c.payments.map((p, k) =>
                  <ListItem key={k}>
                    <GridList cellHeight={18} cols={5} style={{ width: '100%' }}>
                      <GridListTile cols={3}>
                        <span>{p.description}</span>
                      </GridListTile>
                      <GridListTile cols={1} style={{ textAlign: 'center' }}>
                        <span style={{ fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"' }}>{p.fixedPayment ? '' : `${p.number}/${p.qtdInstallments}`}</span>
                      </GridListTile>
                      <GridListTile cols={1}>
                        <Typography component="span" color={p.type === 1 ? 'primary' : 'secondary'}>
                          {toReal(p.cost)}
                        </Typography>
                      </GridListTile>
                    </GridList>
                  </ListItem>
                )}
              </List>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default class Payment extends React.Component {

  constructor(props) {
    super(props)
    const now = new Date()
    let month = now.getMonth() + 12
    let year = now.getFullYear()
    if (month > 12) {
      month = month - 12
      year++
    }
    this.state = {
      loading: true,
      payments: [],
      dates: [],
      totalCost: 0,
      forecastDate: {},
      i: -1,
      j: -1,
      hiddenMonths: {},
      startDate: `${now.getMonth() + 1}/${now.getFullYear()}`,
      endDate: { month, year },
      cards: []
    }
  }

  componentDidMount() {
    this.refresh(this.state.endDate)
  }

  refresh(endDate) {
    this.setState({ loading: true, errorMessage: '', endDate })
    paymentService.getFuture(this.state.startDate, `${endDate.month}/${endDate.year}`)
      .then(res => {
        const dates = Object.keys(res)
        const cards = []
        let total = 0
        dates.forEach(d => {
          res[d].payments.sort((a, b) => a.description > b.description ? 1 : a.description < b.description ? -1 : 0)

          total += res[d].total
        })
        console.log(res[dates[0]])
        setTimeout(() => {
          this.setState({ totalCost: total, loading: false, payments: res, dates })
        }, 300)
      }).catch(err => this.setState({ loading: false, errorMessage: err.message, endDate }))
  }

  showItems(i, j) {
    if (this.state.i === i && this.state.j === j)
      this.setState({ i: -1, j: -1 })
    else
      this.setState({ i: i, j: j })
  }

  hideShowMonth(month) {
    const { hiddenMonths } = this.state
    hiddenMonths[month] = !hiddenMonths[month]
    this.setState({ hiddenMonths: hiddenMonths })
  }

  render() {
    return (
      <CardMain title="Pagamentos" loading={this.state.loading}>
        <Paper>
          <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <InputMonth
              month={this.state.endDate.month}
              year={this.state.endDate.year}
              label="Previsão até"
              onChange={v => this.refresh(v)} />
          </div>
          <List dense={true}>
            {this.state.dates.map((d, i) => {
              const { payments, costExpense, costIncome, accumulatedCost, total } = this.state.payments[d]
              return (<ListItem key={i}>
                <ListItemText>
                  <hr />
                  <span onClick={() => this.hideShowMonth(d)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#666'
                    }}>{getMonthYear(d)}</span>

                  <div hidden={!this.state.hiddenMonths[d]}>
                    <Invoices payments={payments.filter(p => p.invoice)} />

                    <List dense={true}>
                      {payments.filter(p => !p.invoice).map((p, j) =>
                        <ListItem key={j}>
                          <GridList cellHeight={20} cols={6} style={{ width: '100%' }}>
                            <GridListTile cols={3}>
                              <span style={{ color: '#666', fontWeight: 'bold' }}>{p.description}</span>
                            </GridListTile>
                            <GridListTile cols={1}>
                              {
                                p.creditCard ?
                                  <div style={{ display: 'flex' }}>
                                    <CardIcon style={{ color: '#666' }} />
                                    <span style={{ fontSize: '10px', color: '#666', marginLeft: '6px', fontWeight: 'bold', marginTop: '4px' }}>{p.creditCard.name}</span>
                                  </div>
                                  : null
                              }
                            </GridListTile>
                            <GridListTile cols={1} style={{ textAlign: 'center' }}>
                              <span style={{ fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"' }}>{p.fixedPayment ? '' : `${p.number}/${p.qtdInstallments}`}</span>
                            </GridListTile>
                            <GridListTile cols={1}>
                              <Typography component="span" color={p.type === 1 ? 'primary' : 'secondary'}>
                                {toReal(p.cost)}
                              </Typography>
                            </GridListTile>
                          </GridList>
                        </ListItem>
                      )}
                    </List>
                    <ListItemText style={{ textAlign: 'end' }}>
                      <Typography component="span"
                        color={'secondary'}>
                        {`${toReal(costExpense)}`}
                      </Typography>
                      <Typography component="span"
                        color={'primary'}>
                        {`${toReal(costIncome)}`}
                      </Typography>
                      <span style={{
                        border: `solid 1px ${total < 0 ? Colors.AppRed : Colors.AppGreen}`,
                        color: total < 0 ? Colors.AppRed : Colors.AppGreen,
                        marginTop: '6px',
                        padding: '3px'
                      }}>
                        {`= ${toReal(total)}`}
                      </span>
                    </ListItemText>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Typography component="span"
                      color={total < 0 ? 'secondary' : 'primary'}>
                      {`${toReal(accumulatedCost)}`}
                    </Typography>
                  </div>
                  <hr />
                </ListItemText>
              </ListItem>)
            }
            )}
          </List>
          <div style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>
            <span>Total:</span>
            <Typography component="span" style={{ fontSize: '30px' }}
              color={this.state.totalCost < 0 ? 'secondary' : 'primary'}>
              {toReal(this.state.totalCost)}
            </Typography>
          </div>
        </Paper>
      </CardMain>
    )
  }
}