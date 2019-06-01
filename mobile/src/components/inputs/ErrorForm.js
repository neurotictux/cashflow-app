import React from 'react'
import { Text, Animated } from 'react-native'
import PropTypes from 'prop-types'

export default class ErrorForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = { showing: false, translateY: new Animated.Value(-10) }
  }

  componentDidUpdate(prevProps) {
    if (this.props.touched && !!this.props.text !== !!prevProps.text) {
      if (this.props.text) {
        this.setState({ text: this.props.text })
        Animated.spring(
          this.state.translateY, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }).start()
      }
      else
        Animated.spring(
          this.state.translateY, {
            toValue: -10,
            duration: 150,
            useNativeDriver: true
          }).start(() => this.setState({
            text: this.props.text
          }))
    }
  }

  render() {
    return (
      <Animated.View style={{
        translateY: this.state.translateY,
        opacity: this.state.translateY.interpolate({
          inputRange: [-10, 0],
          outputRange: [0, 1]
        })
      }}>
        <Text style={{ color: '#F33' }}>{this.state.text}</Text>
      </Animated.View>
    )
  }
}

ErrorForm.propTypes = {
  touched: PropTypes.bool,
  text: PropTypes.string
}