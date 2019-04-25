import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const validateUser = (user) => {
  if (!user)
    throwValidationError('Usuário inválido.')

  if (!user.name)
    throwValidationError('O nome do usuário é obrigatório.')

  if (!user.email)
    throwValidationError('O email do usuário é obrigatório.')

  if (!user.password || user.password.length < 4)
    throwValidationError('A senha deve ter pelo menos 4 dígitos.')
}

export default (repository) => {
  if (!repository)
    throw 'Invalid parameter \'repository\''
  return {
    getUserData: async (userId) => repository.getUserData(userId),
    create: async (user) => {
      validateUser(user)
      return await repository.create(user)
    },
    update: async (user, userId) => {
      validateUser(user)
      user.userId = userId
      return await repository.update(user, userId)
    },
    remove: async (id, userId) => repository.remove(id, userId)
  }
}