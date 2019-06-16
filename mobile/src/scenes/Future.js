import React from 'react'
import { Text, View, FlatList, Dimensions, Picker } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { PaymentFutureListItem, BaseViewComponent } from '../components'
import { userStorage } from '../storage'
import { toDate, currentMonth, generatePickerMonthYear } from '../utils/string'
import { paymentService } from '../services'

const screenHeight = Dimensions.get('window').height

const monthsYearsPicker = generatePickerMonthYear()

export default class Future extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      payments: {},
      months: [],
      filteredMonths: {},
      loading: true,
      maxHeightList: screenHeight,
      forecastAt: currentMonth(3),
      maxDateStored: null
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh(forecastAt) {
    forecastAt = forecastAt || this.state.forecastAt
    let filtro = null
    if (forecastAt) {
      const date = forecastAt.split('/')
      filtro = `${date[0]}/${date[1]}`
    }

    this.setState({ loading: true })
    console.log('inicio')
    paymentService.getFuture('05/2019', '12/2020')
      .then(res => {
        console.log(res)
        const months = Object.keys(res)
        this.setState({
          months: months,
          payments: res,
          loading: false,
          forecastAt: forecastAt,
          filteredMonths: this.filteredMonths(forecastAt, months)
        })
        // PaymentStorage.saveFuture(res)
      })
      .catch(err => {
        console.warn(err)
        if (err.status !== 401)
          this.setState({ loading: false })
      })
  }

  filteredMonths(month, months) {
    if (month)
      months = months.filter(p => p === month || toDate(p) < toDate(month))
    return months.map((p, i) => ({ key: i + '', value: p }))
  }


  menuSelected(idx) {
    switch (idx) {
      case 0:
        this.refresh()
        break
      case 1:
        // PaymentStorage.saveFuture(null)
        userStorage.save({ token: null }).then(() => Actions.login())
        break
    }
  }

  dateChanged(value) {
    if (value !== this.state.maxDateStored && toDate(value) > toDate(this.state.maxDateStored)) {
      this.refresh(value)
    } else {
      this.setState({
        forecastAt: value,
        filteredMonths: this.filteredMonths(value, this.state.months)
      })
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