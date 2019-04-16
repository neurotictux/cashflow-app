import { authService } from '../services/authService'

import {
  LANGUAGE_CHANGED,
  USER_CHANGED
} from './actionTypes'

export const languageChanged = newLanguage => ({
  type: LANGUAGE_CHANGED,
  payload: newLanguage
})

export const userChanged = user => ({
  type: USER_CHANGED,
  payload: user
})