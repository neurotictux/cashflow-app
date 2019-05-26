import { CreditCard } from './creditCard'

export class PaymentEstimate {

  public id: number = 0
  public description: string = ''
  public userId: number = 0
  public type: number = 0
  public creditCardId: number = 0
  public fixedPayment: boolean = false
  public invoice: boolean = false
  public sync: boolean = false
  public cost: number = 0
  public number: number = 0
  public creditCard: CreditCard | null = null
  public date: Date | null = null
  public paid: boolean = false
  public qtdInstallments: number = 0
  public dateFormatted: string = ''
  public monthYear: string = ''
}