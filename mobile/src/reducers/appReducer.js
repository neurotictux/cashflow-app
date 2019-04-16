import { PAYMENTS_CHANGED } from "../actions/actionTypes";
import { toDate } from "../utils/string";

const initialState = {
  payments: [],
  dates: []
}

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENTS_CHANGED:
      const dates = action.payload.map(p => p.date).filter((e, i, arr) => arr.indexOf(e) === i)
      const sorted = dates.sort((a, b) => toDate(a) > toDate(b) ? -1 : toDate(a) < toDate(b) ? 1 : 0)
      return {
        ...state,
        payments: action.payload,
        dates: sorted
      }
    default:
      return state;
  }
}