import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  CardContent,
  Card,
  Button,
  Zoom,
  FormHelperText
} from '@material-ui/core'

import { Email, Visibility, VisibilityOff, Person } from '@material-ui/icons'

import IconTextInput from '../../components/main/IconTextInput'
import { authService } from '../../services'
import { userChanged } from '../../actions'

const styles = {
  Card: {
    width: '300px',
    margin: '0 auto',
    textAlign: 'center',
    paddingBottom: '20px',
    paddingTop: '20px',
    marginTop: '150px'
  }
}

class Create extends React.Component {

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

  send() {
    authService.createAccount({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }).then(res => {
      setTimeout(() => {
        this.props.userChanged(res)
      }, 500)
    }).catch(err => this.setState({ errorMessage: err.message }))
  }

  render() {
    return (
      <Zoom in={true}>
        <Card style={styles.Card}>
          <CardContent>
            <IconTextInput
              label="Name"
              required
              minlength={5}
              name="name"
              onChange={this.onInputChange}
              Icon={<Person />}
            />
            <IconTextInput
              label="Email"
              email
              required
              name="email"
              onChange={this.onInputChange}
              Icon={<Email />}
            />
            <IconTextInput
              type={this.state.showPassword ? 'text' : 'password'}
              required
              label="Password"
              name="password"
              onChange={this.onInputChange}
              minlength={4}
              Icon={this.state.showPassword ? <VisibilityOff /> : <Visibility />}
              iconClick={() => this.setState({ showPassword: !this.state.showPassword })}
            />
            <IconTextInput
              required
              type={this.state.showConfirm ? 'text' : 'password'}
              label="Confirm"
              name="confirm"
              onChange={this.onInputChange}
              pattern={`^${this.state.password}$`}
              patternMessage="The passwords do not match."
              Icon={this.state.showConfirm ? <VisibilityOff /> : <Visibility />}
              iconClick={() => this.setState({ showConfirm: !this.state.showConfirm })}
            />
          </CardContent>
          <br />
          <Button style={{ width: '250px' }}
            variant="contained"
            onClick={() => this.send()}
            disabled={!this.state.nameValid || !this.state.emailValid || !this.state.passwordValid || !this.state.confirmValid}
            color="primary">Send</Button>
          <br /><br />
          <Button variant="outlined"
            onClick={this.props.changeScene}
            style={{ width: '250px' }} color="primary">back to Login</Button>
          <FormHelperText style={{ textTransform: 'uppercase', textAlign: 'center', marginTop: '8px' }}
            hidden={!this.state.errorMessage} error={true}>
            {this.state.errorMessage}
          </FormHelperText>
        </Card>
      </Zoom>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ userChanged }, dispatch)

export default connect(null, mapDispatchToProps)(Create)