import React from 'react'
import {
  Select, MenuItem, Input,
  FormControl, InputLabel, OutlinedInput
} from '@material-ui/core'
import PropTypes from 'prop-types'

import IconTextInput from './IconTextInput'

class ComboTextInput extends React.Component {
  constructor(props) {
    super(props)
    const options = props.options.map(p => p.toUpperCase())
    options.push('OUTRA...')
    this.state = {
      options: options,
      selected: options[0]
    }
    this.selectChanded = this.selectChanded.bind(this)
    this.textChanged = this.textChanged.bind(this)
  }

  selectChanded(e) {
    this.setState({ selected: e.target.value })
    this.props.onChange(e.target.value === 'OUTRA...' ? '' : e.target.value)
  }

  textChanged(e) {
    this.setState({ text: e.value })
    this.props.onChange(e.value)
  }

  render() {
    return (
      <div>
        <FormControl>
          <InputLabel>{this.props.label}</InputLabel>
          <Select
            input={
              <OutlinedInput
                labelWidth={200}
                name="age"
                id="outlined-age-simple"
              />
            }
            // Colocar checkbox para informar que o usuário irá digitar uma nova área
            value={this.props.selected && this.state.options.indexOf(this.props.selected) !== -1
              ? this.props.selected : this.state.selected}
            style={{ width: this.props.width || '100%' }}
            onChange={this.selectChanded}
            displayEmpty>
            {this.state.options.map((p, i) => <MenuItem key={i} value={p}>{p}</MenuItem>)}
          </Select>
          <div hidden={this.state.options.indexOf(this.props.selected) !== -1 && this.props.selected !== 'OUTRA...'}>
            <IconTextInput
              value={this.props.selected}
              minlength={this.props.minlength}
              required
              onChange={this.textChanged}
              label={this.props.label} />
          </div>
        </FormControl>
      </div>
    )
  }
}

ComboTextInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ComboTextInput