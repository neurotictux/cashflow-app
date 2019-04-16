import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Zoom
} from '@material-ui/core'

import { SuccessAnimatedIcon, ErrorAnimatedIcon } from './Icons'

const styles = {
  success: {
    minWidth: '300px',
    color: 'green',
    fontWeight: 'bold',
    fontSize: '30px'
  }, error: {
    minWidth: '300px',
    color: '#797979',
    fontWeight: 'bold',
    fontSize: '30px'
  }, message: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    textAlign: 'center'
  }
}

export const AlertModal = props => (
  <Dialog
    open={props.show}
    onClose={props.onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    transitionDuration={250}
    TransitionComponent={Zoom}>
    <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
      <div style={styles[props.type]}>
        <div>
          {props.type === 'success' ? <SuccessAnimatedIcon /> : <ErrorAnimatedIcon />}
        </div>
        <span hidden={props.type === 'success'} style={{ marginLeft: '10px' }}>
          Oops...
        </span>
      </div>
    </DialogTitle>
    <DialogContent>
      <div style={styles.message}>
        {props.text}
      </div>
    </DialogContent>
    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
      <Button size="large" color="primary" onClick={() => props.onClose()} variant="raised" autoFocus>ok</Button>
    </div>
  </Dialog>
)