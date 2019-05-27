import { CreditCard } from '../creditCard'

export interface ICreditCardRepository {
  getByUser(userId: number): Promise<CreditCard[]>
  create(card: CreditCard): Promise<CreditCard>
  update(card: CreditCard): Promise<CreditCard>
  remove(card: CreditCard): Promise<CreditCard>
}
