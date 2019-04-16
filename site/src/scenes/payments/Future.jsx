import React from 'react'

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core'

import CardMain from '../../components/main/CardMain'
import InputMonth from '../../components/inputs/InputMonth'

import { paymentService } from '../../services/index'

import { toReal, getMonthYear } from '../../helpers/utils'
import { Colors } from '../../helpers/themes'

export default class Payment extends React.Component {

  constructor(props) {
    super(props)
    const now = new Date()
    let month = now.getMonth() + 3
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
      forecastDate: { month, year },
      i: -1,
      j: -1,
      hiddenMonths: {}
    }
  }

  componentDidMount() {
    this.refresh(this.state.forecastDate)
  }

  refresh(forecastDate) {
    this.setState({ loading: true, errorMessage: '', forecastDate })
    paymentService.getFuture(`${forecastDate.month}/01/${forecastDate.year}`)
      .then(res => {
        const dates = Object.keys(res)
        let total = 0
        dates.forEach(d => total += res[d].cost)
        setTimeout(() => {
          this.setState({ totalCost: total, loading: false, payments: res, dates })
        }, 300)
      }).catch(err => this.setState({ loading: false, errorMessage: err.message, forecastDate }))
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
              month={this.state.forecastDate.month}
              year={this.state.forecastDate.year}
              label="Previsão até"
              onChange={v => this.refresh(v)} />
          </div>
          <List dense={true}>
            {this.state.dates.map((d, i) =>
              <ListItem key={i}>
                <ListItemText>
                  <hr />
                  <span onClick={() => this.hideShowMonth(d)} style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#666' }}>{getMonthYear(d)}</span>
                  <div hidden={!this.state.hiddenMonths[d]}>
                    <List dense={true}>
                      {this.state.payments[d].payments.map((p, j) =>
                        <ListItem key={j}>
                          <ListItemText style={{ width: '300px', textAlign: 'left' }}>
                            {p.isCreditCard ? <span style={{ fontWeight: 'bold' }}>Fatura: </span> : null}
                            {p.description}

                            <div hidden={this.state.i !== i || this.state.j !== j}>
                              <List dense={true}>
                                {p.items.map((g, k) =>
                                  <ListItem key={k}>
                                    <ListItemText style={{ width: '100px', textAlign: 'right' }}>
                                      {g.description}
                                      <span style={{ marginLeft: 10, color: Colors.AppRed }}>{toReal(g.cost)}</span>
                                    </ListItemText>
                                  </ListItem>
                                )}
                              </List>
                            </div>

                          </ListItemText>
                          <ListItemText>
                            <Typography component="span" color={p.type === 1 ? 'primary' : 'secondary'}>
                              {toReal(p.cost)}
                              {p.isCreditCard ? <span onClick={() => this.showItems(i, j)} style={{ marginLeft: 20, color: 'gray', cursor: 'pointer' }}>Itens</span> : null}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      )}
                    </List>
                    <ListItemText style={{ textAlign: 'end' }}>
                      <Typography component="span"
                        color={'secondary'}>
                        {`${toReal(this.state.payments[d].costExpense)}`}
                      </Typography>
                      <Typography component="span"
                        color={'primary'}>
                        {`${toReal(this.state.payments[d].costIncome)}`}
                      </Typography>
                      <span style={{
                        border: `solid 1px ${this.state.payments[d].cost < 0 ? Colors.AppRed : Colors.AppGreen}`,
                        color: this.state.payments[d].cost < 0 ? Colors.AppRed : Colors.AppGreen,
                        marginTop: '6px',
                        padding: '3px'
                      }}>
                        {`= ${toReal(this.state.payments[d].cost)}`}
                      </span>
                    </ListItemText>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Typography component="span"
                      color={this.state.payments[d].cost < 0 ? 'secondary' : 'primary'}>
                      {`${toReal(this.state.payments[d].acumulatedCost)}`}
                    </Typography>
                  </div>
                  <hr />
                </ListItemText>
              </ListItem>
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