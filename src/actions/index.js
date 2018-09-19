import { PAYMENTS_CHANGED, DATES_CHANGED } from "./actionTypes";

export const paymentsChanged = value => ({
  type: PAYMENTS_CHANGED,
  payload: value
})