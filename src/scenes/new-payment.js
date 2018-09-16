import React, { Component } from 'react'
import { Text, Button, Picker, View, TextInput } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { Actions } from 'react-native-router-flux'
import { Checkbox } from 'react-native-material-ui'
import { PaymentType } from '../utils/constants'
import { PaymentService } from '../db/database'
import { toMoney, fromMoney, fromMoneyString } from '../utils/string';

const styles = {
  input: {
    width: 200,
    borderColor: '#000',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  }
}

export class NewPayment extends Component {

  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
    this.remove = this.remove.bind(this)
    this.duplicate = this.duplicate.bind(this)
    const p = props.payment || { type: PaymentType.LOSS }
    this.state = {
      appId: p.appId,
      description: p.description,
      cost: toMoney(p.cost ? p.cost : '0'),
      type: p.type || PaymentType.LOSS,
      date: p.date,
      paid: p.paid,
      error: ''
    }
  }

  save() {
    PaymentService.save({
      appId: this.state.appId,
      description: this.state.description,
      cost: fromMoney(this.state.cost),
      type: this.state.type,
      date: this.state.date,
      paid: this.state.paid,
    }).then(() => Actions.pop())
      .catch(err => this.setState({ error: err }))
  }

  remove() {
    PaymentService.remove(this.state.appId)
      .then(() => Actions.pop())
      .catch(err => this.setState({ error: err }))
  }

  duplicate() {
    PaymentService.save({
      appId: 0,
      description: this.state.description,
      cost: fromMoney(this.state.cost),
      type: this.state.type,
      date: this.state.date,
      paid: this.state.paid,
    }).then(() => Actions.pop())
      .catch(err => this.setState({ error: err }))
  }

  render() {
    return (
      <View style={{ marginTop: 80, alignItems: 'center', justifyContent: 'space-between', height: 400 }}>
        <TextInput
          onChangeText={t => this.setState({ error: '', description: t })}
          value={this.state.description}
          placeholder="Description"
          style={styles.input}
        />
        <TextInput
          onChangeText={t => this.setState({ error: '', cost: fromMoneyString(t) })}
          onBlur={t => this.setState({ cost: toMoney(this.state.cost) })}
          value={this.state.cost}
          placeholder="Cost"
          style={styles.input}
        />
        <View style={{ width: 200, borderBottomWidth: 1, alignItems: 'flex-end' }}>
          <Picker
            selectedValue={this.state.type}
            style={{ height: 50, width: 200 }}
            onValueChange={(itemValue, index) => this.setState({ error: '', type: itemValue })}>
            <Picker.Item label="LOSS" value={PaymentType.LOSS} />
            <Picker.Item label="GAIN" value={PaymentType.GAIN} />
          </Picker>
        </View>
        <DatePicker
          style={{ width: 200, marginTop: 30 }}
          date={this.state.date}
          mode="date"
          placeholder="Pay day"
          format="DD-MM-YYYY"
          minDate="01-01-2000"
          maxDate="01-01-2030"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 40
            }
          }}
          onDateChange={(date) => { this.setState({ error: '', date: date }) }}
        />
        <View style={{ marginTop: 20 }} width={200} height={30}>
          <Checkbox onCheck={(checked) => this.setState({ paid: checked })} label="Paid ?" value="agree" checked={this.state.paid} />
        </View>
        <View style={{ marginTop: 30, justifyContent: 'space-between' }} height={120} width={200}>
          <Button onPress={this.save} raised={true} color='#282' title='Save' />
          {this.state.appId ?
            <View style={{ marginTop: 10, justifyContent: 'space-between' }} height={80}>
              <Button onPress={this.duplicate} raised={true} primary={true} title='Duplicate' />
              <Button onPress={this.remove} raised={true} color='#C00' title='delete' />
            </View>
            : null}
        </View>
        <Text style={{ color: '#F33' }}>{this.state.error}</Text>
      </View>
    )
  }
}