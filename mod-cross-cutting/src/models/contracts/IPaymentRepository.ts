import { Payment } from '../payment'

export interface IPaymentRepository {
  getByUser(userId: number): Promise<Payment[]>
  getById(id: number): Promise<Payment>
  create(payment: Payment): Promise<number>
  update(payment: Payment): Promise<void>
  remove(payment: Payment): Promise<void>
}