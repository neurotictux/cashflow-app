import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const validateCard = (card) => {
    if (!card)
        throwValidationError('Cartão inválido.')

    if (!card.name)
        throwValidationError('O nome do cartão é obrigatório.')

    if (card.description && typeof (card.description) !== 'string')
        card.description = null
}

export default (repository) => {
    if (!repository)
        throw 'Invalid parameter \'repository\''
    return {
        getByUser: async (userId) => repository.getByUser(userId),
        create: async (card) => {
            validateCard(card)
            return await repository.create(card)
        },
        update: async (card) => {
            validateCard(card)
            const cards = await repository.getByUser(card.userId)
            if (!cards.filter(p => p.id === card.id).length)
                throwValidationError('Cartão não localizado.')
            return repository.update(card)
        },
        remove: async (card) => {
            const cards = await repository.getByUser(card.userId)
            if (!cards.filter(p => p.id === Number(card.id)).length)
                throwValidationError('Cartão não localizado.')
            return repository.remove(card)
        }
    }
}