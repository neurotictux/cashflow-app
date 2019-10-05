import React from 'react'
import { FlatList, ToastAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { PaymentFutureListItem, BaseViewComponent } from '../components'
import { userStorage } from '../storage'
import { toDate } from '../utils/string'
import { paymentService } from '../services'
import { paymentStorage } from '../storage'

export default class Future extends React.Component {

  constructor(props) {
    super(props)
    const now = new Date()
    this.state = {
      payments: {},
      months: [],
      filteredMonths: [],
      loading: true,
      updates: 0,
      forecastAt: { month: now.getMonth() + 1, year: now.getFullYear() + 1 }
    }
  }

  componentDidMount() {
    paymentStorage.get()
      .then(pays => {
        const months = Object.keys(pays || [])
        if (months.length) {
          this.setState({ loading: false, months, payments: pays })
          this.updateList(this.state.forecastAt, months, pays)
        } else
          this.fetchPayments()
      })
      .catch(err => {
        this.setState({ loading: false })
        console.warn(err)
      })
  }

  fetchPayments() {
    const start = new Date()
    const end = new Date(start.getFullYear() + 5, 12, 0)
    const startDate = `${start.getMonth() + 1}/${start.getFullYear()}`
    const endDate = `${end.getMonth() + 1}/${end.getFullYear()}`

    this.setState({ loading: true })
    paymentService.getFuture(startDate, endDate)
      .then(pays => {
        ToastAndroid.show('Dados atualizados!', ToastAndroid.SHORT)
        paymentStorage.save(pays)
        const months = Object.keys(pays)
        this.updateList(this.state.forecastAt, months, pays)
        this.setState({ loading: false })
      })
      .catch(err => {
        console.warn(err)
        if (err.status !== 401)
          this.setState({ loading: false })
      })
  }

  updateList(forecastAt, months, payments) {
    const forecastAtStr = `${forecastAt.month}/${forecastAt.year}`
    const filteredMonths = this.state.months
      .filter(p => p === forecastAtStr || toDate(p) < toDate(forecastAtStr))
      .map((p, i) => ({ key: i + '', value: p }))

    if (months && payments)
      this.setState({ filteredMonths, months, payments })
    else
      this.setState({ filteredMonths })
  }

  loadMore() {
    const { forecastAt, updates } = this.state
    if (updates <= 2) {
      forecastAt.year++
      this.updateList(forecastAt)
      this.setState({ updates: updates + 1 })
      console.log(updates)
    }
  }

  menuSelected(idx) {
    switch (idx) {
      case 0:
        this.fetchPayments()
        break
      case 1:
        userStorage.save({ token: null }).then(() => Actions.login())
        break
    }
  }

  render() {
    return (
      <BaseViewComponent
        currentPage={0}
        title="Estimativa Financeira"
        menuSelected={index => this.menuSelected(index)}
        loading={this.state.loading}>
        <FlatList
          onEndReached={() => this.loadMore()}
          data={this.state.filteredMonths}
          renderItem={({ item }) => {
            const monthYear = item.value.split('/')
            return <PaymentFutureListItem
              month={monthYear[0]}
              year={monthYear[1]}
              payments={this.state.payments[item.value]}
            />
          }}
        />
      </BaseViewComponent>
    )
  }
}