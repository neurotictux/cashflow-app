import React from 'react'
import { ActivityIndicator, Text, View, TextInput, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { accountService } from '../services'
import { TokenStorage, UserStorage } from '../storage'

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
    UserStorage.get().then(user => {
      if (user && user.email)
        this.setState({ email: user.email })
    })
    TokenStorage.getAsync().then(token => {
      if (token)
        Actions.futurePayments()
    })
  }

  login() {
    this.setState({ loading: true, error: '' })
    accountService.token(this.state.email, this.state.password)
      .then(res => {
        this.setState({ loading: false, error: '' })
        UserStorage.save({ email: this.state.email })
        TokenStorage.save(res.token).then(() => Actions.futurePayments())
      })
      .catch(err => this.setState({
        loading: false,
        error: err.message || 'Erro desconhecido'
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
        <Text style={{ color: '#C00', marginTop: 10 }}>{this.state.error}</Text>
      </View>
    )
  }
}