import React, { Component } from 'react'
import { TextInput } from 'react-native'

export class PatternTextInput extends Component {

  constructor(props) {
    super(props)
    if (!props.pattern)
    this.textChanged = this.textChanged.bind(this)
    this.state = { text: '', pattern: new RegExp(props.pattern) }
  }

  textChanged(newValue) {
    if (this.state.pattern.test(newValue)) {
      this.setState({ text: newValue })
      if (this.props.onChangeText)
        this.props.onChangeText(newValue)
    }
  }

  render() {
    return (
      <TextInput
        onChangeText={t => this.textChanged(t)}
        value={this.state.text}
        placeholder={this.props.placeholder}
        style={this.props.style}
      />
    )
  }
}