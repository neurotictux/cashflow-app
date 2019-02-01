import React from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'

export default class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim, {
        toValue: 1,
        duration: this.props.duration
      }).start()
  }

  render() {
    let { fadeAnim } = this.state

    return (
      <Animated.View style={{ ...this.props.style, opacity: fadeAnim }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

FadeInView.propTypes = {
  duration: PropTypes.number
}

FadeInView.defaultProps = {
  duration: 500
}