import { CreditCard, Installment } from './'

export class Payment {

  public id: number = 0
  public description: string = ''
  public userId: number = 0
  public type: number = 0
  public creditCard: CreditCard | null = null
  public creditCardId: number = 0
  public fixedPayment: boolean = false
  public invoice: boolean = false
  public sync: boolean = false
  public installments: Installment[] = []
}