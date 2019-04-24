import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const validateCard = (card) => {
    if (!card)
        throwValidationError('Cartão inválido.')

    if (!card.name)
        throwValidationError('A nome do cartão é obrigatório.')
}

export default (repository) => {
    if (!repository)
        throw 'Invalid parameter \'repository\''
    return {
        getAll: (userId) => repository.getAll(userId),
        create: (card, userId) => {
            validateCard(card)
            card.userId = userId
            return repository.create(card)
        },
        update: (card, userId) => {
            validateCard(card)
            card.userId = userId
            return repository.update(card, userId)
        },
        remove: (id, userId) => repository.remove(id, userId)
    }
}