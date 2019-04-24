import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const validateCard = (card) => {
    if (!card)
        throwValidationError('Cartão inválido.')

    if (!card.name)
        throwValidationError('O nome do cartão é obrigatório.')
}

export default (repository) => {
    if (!repository)
        throw 'Invalid parameter \'repository\''
    return {
        getAll: async (userId) => repository.getAll(userId),
        create: async (card, userId) => {
            validateCard(card)
            card.userId = userId
            return await repository.create(card)
        },
        update: async (card, userId) => {
            validateCard(card)
            card.userId = userId
            return repository.update(card, userId)
        },
        remove: async (id, userId) => repository.remove(id, userId)
    }
}