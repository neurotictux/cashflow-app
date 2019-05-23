import React from 'react'
import { Text, View, FlatList, Dimensions, Picker } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { PaymentService } from '../services'
import { PaymentFutureListItem, BaseViewComponent } from '../components'
import { PaymentStorage, TokenStorage } from '../storage'
import { toDate, currentMonth, generatePickerMonthYear } from '../utils/string'

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
    PaymentStorage.getFuture()
      .then(res => {
        console.log(res)
        if (res) {
          const months = Object.keys(res)
          const maxDateStored = months[months.length - 1]
          this.setState({
            months: months,
            payments: res,
            forecastAt: maxDateStored,
            maxDateStored: maxDateStored,
            loading: false,
            filteredMonths: this.filteredMonths(null, months)
          })
        }
        else
          this.refresh()
      })
  }

  refresh(forecastAt) {
    forecastAt = forecastAt || this.state.forecastAt
    let filtro = null
    if (forecastAt) {
      const date = forecastAt.split('/')
      filtro = `${date[0]}/${date[1]}`
    }

    if (!this.state.loading)
      this.setState({ loading: true })

    PaymentService.getFuture('05/2019', '12/2020')
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
        PaymentStorage.saveFuture(res)
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
        PaymentStorage.saveFuture(null)
        TokenStorage.save(null).then(() => Actions.login())
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
        title="Estimativa Financeira"
        menuSelected={index => this.menuSelected(index)}
        loading={this.state.loading}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ marginRight: 10 }}>Previsão até:</Text>
          <Picker
            mode="dropdown"
            selectedValue={this.state.forecastAt}
            style={{ height: 50, width: 140, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
            onValueChange={date => this.dateChanged(date)}>
            {monthsYearsPicker.map((p, i) => <Picker.Item key={i} label={p} value={p} />)}
          </Picker>
        </View>

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