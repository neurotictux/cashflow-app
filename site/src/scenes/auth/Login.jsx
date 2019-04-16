import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Email, Visibility, VisibilityOff } from '@material-ui/icons'
import {
  CardContent,
  Card,
  Button,
  Zoom,
  FormHelperText,
  CircularProgress
} from '@material-ui/core'

import IconTextInput from '../../components/main/IconTextInput'
import { userChanged } from '../../actions'
import { authService } from '../../services'

const styles = {
  Card: {
    width: '300px',
    margin: '0 auto',
    textAlign: 'center',
    paddingBottom: '20px',
    paddingTop: '20px',
    marginTop: '150px'
  },
  Or: {
    textAlign: 'center',
    color: '#666',
    marginTop: '25px',
    fontWeight: 'bold',
    fontFamily: 'Arial'
  }
}

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(e) {
    this.setState({
      [e.name]: e.value,
      [`${e.name}Valid`]: e.valid,
      errorMessage: ''
    })
  }

  login(e) {
    if (this.state.loading) return;
    this.setState({ loading: true })
    if (e)
      e.preventDefault()
    authService.login({
      email: this.state.email,
      password: this.state.password
    }).then(user => {
      setTimeout(() => this.setState({ loading: false }), 500)
      setTimeout(() => this.props.userChanged(user), 600)
    }).catch(err => {
      setTimeout(() => this.setState({
        errorMessage: err.status === 401 ? 'Email ou Senha inválidos.' : err.message,
        loading: false
      }), 300)
    })
  }

  render() {
    return (
      <Zoom in={true}>
        <Card style={styles.Card}>
          <form onSubmit={e => this.login(e)}>
            <CardContent>
              <IconTextInput
                label="Email"
                required
                email
                disabled={this.state.loading}
                name="email"
                onChange={this.onInputChange}
                validChanged={valid => this.setState({ emailValid: valid })}
                Icon={<Email />}
              />
              <IconTextInput
                type={this.state.showPassword ? 'text' : 'password'}
                label="Senha"
                required
                minlength={4}
                onChange={this.onInputChange}
                name="password"
                disabled={this.state.loading}
                Icon={this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                iconClick={() => this.setState({ showPassword: !this.state.showPassword })} />
            </CardContent>
            <br />
            <div style={{ marginBottom: '10px' }} hidden={!this.state.loading}>
              <CircularProgress />
            </div>
            <div hidden={this.state.loading}>
              <Button style={{ width: '250px' }}
                variant="contained"
                disabled={!this.state.emailValid || !this.state.passwordValid}
                type="submit"
                onClick={() => this.login()}
                color="primary">Login</Button>
              <br /><br />
              <Button style={{ width: '250px' }}
                variant="outlined"
                onClick={this.props.changeScene}
                color="primary">Create Account</Button>
              <FormHelperText style={{ textTransform: 'uppercase', textAlign: 'center', marginTop: '8px' }}
                hidden={!this.state.errorMessage} error={true}>
                {this.state.errorMessage}
              </FormHelperText>
            </div>
          </form>
        </Card>
      </Zoom >
    )
  }
}

Login.propTypes = {
  changeScene: PropTypes.func
}

const mapDispatchToProps = dispatch => bindActionCreators({ userChanged }, dispatch)

export default connect(null, mapDispatchToProps)(Login)