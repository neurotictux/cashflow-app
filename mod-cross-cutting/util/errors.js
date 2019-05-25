/**
 * Tipos de erros a serem tratados
 */
export const ErrorTypes = {
  VALIDATION: 1
}

/**
 * 
 * @param {String} message 
 */
export const throwValidationError = (message) => { throw { message, type: ErrorTypes.VALIDATION } }

/**
 * 
 * @param {String} serviceName 
 * @param {String} functionName 
 */
export const throwRepositoryError = (serviceName, functionName) =>
  `Parameter repository in ${serviceName}  must have a function ${functionName} that returns a promise.`