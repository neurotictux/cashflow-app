import { STORAGE_KEYS } from '../helpers/storageKeys'
import { USER_CHANGED } from '../actions/actionTypes'

const initialState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
}

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_CHANGED:
      if (action.payload)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload))
      else
        localStorage.removeItem(STORAGE_KEYS.USER)
      return { ...state, user: action.payload }
    default:
      return state;
  }
}