import React from 'react'
import { Text, View, TextInput } from 'react-native'
import PropTypes from 'prop-types'

import ErrorForm from './ErrorForm'

const TextInputLayout = ({ onChangeText, style, label, value, error, touched }) => {
  console.log(error)
  return (
    <View style={{ margin: 10, padding: 0, ...(style || {}).container }}>
      <Text style={{
        marginTop: value ? -10 : 5,
        position: 'absolute',
        color: error ? '#F66' : undefined
      }}>{label || ''}</Text>
      <TextInput
        onChangeText={t => onChangeText(t)}
        value={value}
        style={{
          width: 200,
          borderBottomColor: error ? '#F66' : '#000',
          borderBottomWidth: 1,
          fontSize: 20,
          padding: 3,
          margin: 0
        }} />
      <ErrorForm touched={touched} text={error} />
    </View >
  )
}

TextInputLayout.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object,
  error: PropTypes.string,
  touched: PropTypes.bool
}

export default TextInputLayout