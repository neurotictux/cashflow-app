import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { Reducers } from '../reducers'

const logger = createLogger()

export const Store = createStore(
  Reducers,
  applyMiddleware(thunk, logger)
)