import { throwValidationError } from '../../../crosscutting/errors'

const emailRegex = /^[a-zA-Z0-9!#$.%&*()_]{3,20}@[a-zA-Z0-9]{1,20}[.][a-zA-Z0-9]{1,20}([.][a-zA-Z0-9]{1,20})?$/

const validatePassword = (password) => {
  if (!password || password.length < 4)
    throwValidationError('A senha deve ter pelo menos 4 dígitos.')
}

const validateUser = (user) => {
  if (!user)
    throwValidationError('Usuário inválido.')

  if (!user.name)
    throwValidationError('O nome do usuário é obrigatório.')

  if (!user.email)
    throwValidationError('O email do usuário é obrigatório.')

  if (!emailRegex.test(user.email))
    throwValidationError('Email inválido.')

  if (!user.id)
    validatePassword(user.password)
}

export default (repository) => {
  if (!repository)
    throw 'Invalid parameter \'repository\''
  return {
    getUserData: async (userId) => repository.getUserData(userId),
    getByEmail: async (email) => repository.getByEmail(email),
    create: async (user) => {
      validateUser(user)
      const userDb = await repository.getByEmail(user.email)
      if (userDb)
        throwValidationError('Este email já está em uso por outro usuário.')
      return await repository.create(user)
    },
    update: async (user) => {
      validateUser(user)
      const userDb = await repository.getByEmail(user.email)
      if (userDb && userDb.id !== user.id)
        throwValidationError('Este email já está em uso por outro usuário.')
      return await repository.update(user)
    },
    updatePassword: async (user) => {
      validatePassword(user.password)
      return repository.updatePassword(user)
    }
  }
}