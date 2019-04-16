import React from 'react'
import {
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core'
import PropTypes from 'prop-types'

import { Months } from '../../helpers/utils'

class InputMonth extends React.Component {
  constructor(props) {
    super(props)
    const now = new Date()
    const years = [now.getFullYear() - 1]
    for (let i = 1; i <= 5; i++)
      years.push(years[0] + i)

    this.state = {
      years,
    }
  }

  valueChanged(month, year) {
    this.setState({ month, year })
    if (this.props.onChange)
      this.props.onChange({ month, year })
  }

  render() {
    return (
      <span>
        <div>
          <InputLabel style={{ height: '8px', fontSize: '10px' }}>{this.props.label}</InputLabel>
        </div>
        <Select
          value={this.props.month}
          style={{ width: '130px' }}
          onChange={(e) => this.valueChanged(e.target.value, this.props.year)}>
          {Months.map((p, i) => <MenuItem key={i} value={i + 1}>{p}</MenuItem>)}
        </Select>
        <Select
          value={this.props.year}
          style={{ width: '80px', marginLeft: '10px' }}
          onChange={(e) => this.valueChanged(this.props.month, e.target.value)}>
          {this.state.years.map((p, i) => <MenuItem key={i} value={p}>{p}</MenuItem>)}
        </Select>
      </span>
    )
  }
}


InputMonth.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  label: PropTypes.string
}

export default InputMonth