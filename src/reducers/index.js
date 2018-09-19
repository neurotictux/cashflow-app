import { appReducer } from './appReducer'
import { combineReducers } from 'redux'

export const Reducers = combineReducers({
  appState: appReducer
})