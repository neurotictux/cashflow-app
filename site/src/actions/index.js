import {
  LANGUAGE_CHANGED,
  USER_CHANGED,
  CHANGE_VISIBLE_ALERT
} from './actionTypes'

export const languageChanged = newLanguage => ({
  type: LANGUAGE_CHANGED,
  payload: newLanguage
})

export const userChanged = user => ({
  type: USER_CHANGED,
  payload: user
})

export const showError = (message) => ({
  type: CHANGE_VISIBLE_ALERT,
  payload: { message, type: 'error', show: true }
})

export const showSuccess = (message) => ({
  type: CHANGE_VISIBLE_ALERT,
  payload: { message, type: 'success', show: true }
})

export const hideAlert = () => ({
  type: CHANGE_VISIBLE_ALERT,
  payload: { message: '', show: false }
})