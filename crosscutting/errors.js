const ErrorTypes = {
  VALIDATION: 1
}

const throwValidationError = (message) => { throw { message, type: ErrorTypes.VALIDATION } }

module.exports = {
  ErrorTypes: ErrorTypes,
  throwValidationError: throwValidationError
}