import { appReducer } from './appReducer'
import { modalReducer } from './modalReducer'
import { combineReducers } from 'redux'

export const Reducers = combineReducers({
  appState: appReducer,
  modalState: modalReducer
})