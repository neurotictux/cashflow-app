import { User } from '..'

export interface IUserRepository {
  getUserData(userId: number): Promise<User>
  getByEmail(email: string): Promise<User>
  create(user: User): Promise<User>
  update(user: User): Promise<User>
  updatePassword(user: User): Promise<User>
}