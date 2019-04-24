import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const repository = {}

const validatePayment = (payment) => {
  if (!payment)
    throwValidationError('Pagamento inválido.')

  if (String.IsNullOrEmpty(payment.Description))
    throwValidationError('A descrição é obrigatória.')

  if (payment.Cost <= 0)
    throwValidationError('O valor deve ser maior que Zero.')

  if (!payment.FirstPayment)
    throwValidationError('A data do primeiro pagamento é obrigatória.')

  if (!payment.SinglePlot && !payment.FixedPayment) {
    if (payment.PlotsPaid > payment.Plots)
      throwValidationError('A quantidade parcelas pagas não pode ser maior que o número de parcelas.')

    if (payment.Plots <= 0)
      throwValidationError('O pagamento deve ter pelo menos 1 parcela.')
  }

  if (payment.creditCard && payment.CreditCard.id) {
    const card = repository.GetById(payment.CreditCard.id)
    if (!card)
      throwValidationError('Cartão não localizado.')
  }
}

export default (repository) => {
  if (!repository)
    throw 'Invalid parameter \'repository\''
  return {
    create: (payment) => {
      validatePayment(payment)
      return repository.create(payment)
    }
  }
}