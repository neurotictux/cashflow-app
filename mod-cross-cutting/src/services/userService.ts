import { IUserRepository, User } from '../models'
import { throwValidationError } from '../util'

const emailRegex = /^[a-zA-Z0-9!#$.%&*()_]{3,20}@[a-zA-Z0-9]{1,20}[.][a-zA-Z0-9]{1,20}([.][a-zA-Z0-9]{1,20})?$/

const validatePassword = (password: string) => {
  if (!password || password.length < 4)
    throwValidationError('A senha deve ter pelo menos 4 dígitos.')
}

const validateUser = (user: User) => {
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

export class UserService {
  private repository: IUserRepository
  constructor(repository: IUserRepository) {
    if (!repository)
      throw Error('Invalid parameter \'repository\'')
    this.repository = repository
  }

  public async getUserData(userId: number) {
    return this.repository.getUserData(userId)
  }

  public async getByEmail(email: string) {
    return this.repository.getByEmail(email)
  }

  public async create(user: User) {
    validateUser(user)
    const userDb = await this.repository.getByEmail(user.email)
    if (userDb)
      throwValidationError('Este email já está em uso por outro usuário.')
    return await this.repository.create(user)
  }

  public async update(user: User) {
    validateUser(user)
    const userDb = await this.repository.getByEmail(user.email)
    if (userDb && userDb.id !== user.id)
      throwValidationError('Este email já está em uso por outro usuário.')
    return await this.repository.update(user)
  }

  public async updatePassword(user: User) {
    validatePassword(user.password)
    return this.repository.updatePassword(user)
  }
}