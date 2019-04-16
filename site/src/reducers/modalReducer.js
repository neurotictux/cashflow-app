import { CHANGE_VISIBLE_ALERT } from '../actions/actionTypes'

const initialState = {
  show: false,
  message: '',
  type: 'success'
}

export const modalReducer = (state = initialState, action) => {
  if (action.type === CHANGE_VISIBLE_ALERT) {
    return action.payload
    console.log(action)
  }
  return state
}