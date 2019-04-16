import React from 'react'
import Login from './Login'
import Create from './Create'

export default class AuthComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { login: true }
  }
  render() {
    return (
      <div>
        {
          this.state.login ?
            <Login changeScene={() => this.setState({ login: false })} />
            :
            <Create changeScene={() => this.setState({ login: true })} />
        }
      </div>
    )
  }
}
