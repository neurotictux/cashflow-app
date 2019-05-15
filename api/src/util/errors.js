export const ErrorTypes = {
  VALIDATION: 1
}

export const throwValidationError = (message) => { throw { message, type: ErrorTypes.VALIDATION } }