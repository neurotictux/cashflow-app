/**
 * Tipos de erros a serem tratados
 */
export const ErrorTypes = {
  VALIDATION: 1
}

/**
 *
 * @param {String} msg
 */
export const throwValidationError = (message: string) => { throw { message, type: ErrorTypes.VALIDATION } }

/**
 *
 * @param {String} serviceName
 * @param {String} functionName
 */
export const throwRepositoryError = (serviceName: string, functionName: string) => {
  const msg = `Parameter repository in ${serviceName}  must have a function ${functionName} that returns a promise.`
  throw new Error(msg)
}