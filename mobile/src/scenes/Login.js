import React from 'react'
import { ActivityIndicator, Text, View, TextInput, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { accountService } from '../services'
import { userStorage } from '../storage'

import { ErrorForm } from '../components'

const styles = {
  input: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: 200,
    marginTop: 20
  }
}

export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = { email: '', password: '', error: '', loading: false }
  }

  componentDidMount() {
    userStorage.get().then(({ email, token }) => {
      if (token)
        Actions.futurePayments()
      else if (email) {
        this.setState({ email: email })
      }
    })
  }

  login() {
    this.setState({ loading: true, error: '' })
    accountService.token(this.state.email, this.state.password)
      .then(res => {
        this.setState({ loading: false, error: '' })
        const user = {
          email: this.state.email,
          token: res.token
        }
        userStorage.save(user).then(() => {
          console.log('Actions.futurePayments()')
          Actions.futurePayments()
        })
      })
      .catch(err => this.setState({
        loading: false,
        error: err.message
      }))
  }

  render() {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <TextInput value={this.state.email}
          onChangeText={e => this.setState({ email: e })}
          style={styles.input} placeholder="Email" />
        <TextInput secureTextEntry={true}
          onChangeText={e => this.setState({ password: e })}
          style={styles.input}
          placeholder="Senha" />
        <View style={{ marginTop: 40 }}>
          {
            this.state.loading ?
              <ActivityIndicator size="large" />
              :
              <Button onPress={() => this.login()} title="Entrar" raised={true} color='#282'></Button>
          }
        </View>
        <ErrorForm style={{ marginTop: 10 }} touched={true} text={this.state.error} />
      </View>
    )
  }
}