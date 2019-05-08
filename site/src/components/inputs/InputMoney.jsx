import React from 'react'
import {
    FormControl,
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@material-ui/core'
import NumberFormat from 'react-number-format'
import TextInputMask from 'react-masked-text'

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    }
                })
            }}
            thousandSeparator="."
            decimalSeparator={","}
            decimalScale={3}

            fixedDecimalScale={true}
            prefix="R$ "
        />
    )
}

const maskMoney = (props) => (
    <TextInputMask
        ref={'myDateText'}
        kind={'money'}
        style={{ backgroundColor: 'white', border: 'solid 1px' }} />
)

export default class InputMoney extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            costType: 'byInstallment',
            costText: 0
        }
    }

    costChanged(val) {
        console.log(val)
        this.setState({
            cost: Number(val.replace(/[^0-9,]/g, '').replace(',', '.'))
        })
    }

    render() {
        return (
            <div>
                <RadioGroup
                    aria-label="gender"
                    name="gender2"
                    style={{ width: '160px' }}
                    value={this.state.costType}
                    onChange={e => this.setState({ costType: e.target.value })}>
                    <FormControlLabel
                        value="byInstallment"
                        control={<Radio color="primary" />}
                        label="Valor da Parcela"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="byTotal"
                        control={<Radio color="primary" />}
                        label="Valor Total"
                        labelPlacement="end"
                        style={{ marginTop: '-10px' }}
                    />
                </RadioGroup>
                <div>
                    <span style={{ marginRight: '10px' }}>Valor:</span>
                    <TextInputMask
                        onChangeText={e => this.setState({ costText: e })}
                        kind={'money'}
                        value={this.state.costText}
                        style={{
                            color: '#666',
                            backgroundColor: 'white',
                            border: 'solid 0',
                            borderBottom: 'solid 1px #666'
                        }} />
                </div>
            </div>
        )
    }
}