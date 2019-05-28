import { PAYMENTS_CHANGED } from './actionTypes'

export const paymentsChanged = value => ({
  type: PAYMENTS_CHANGED,
  payload: value
})