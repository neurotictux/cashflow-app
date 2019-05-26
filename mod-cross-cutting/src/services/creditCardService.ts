import { CreditCard, ICreditCardRepository } from '../models'
import { throwRepositoryError, throwValidationError } from '../util'

const validateCard = (card: { name: string, description: string }) => {
    if (!card)
        throwValidationError('Cartão inválido.')

    if (!card.name)
        throwValidationError('O nome do cartão é obrigatório.')

    if (card.description && typeof (card.description) !== 'string')
        card.description = ''
}

export class CreditCardService {

    private repository: ICreditCardRepository

    constructor(repository: ICreditCardRepository) {
        if (!repository)
            throw Error('Invalid parameter \'repository\'')
        this.repository = repository
    }

    public async getByUser(userId: number) {
        if (!this.repository.getByUser)
            throwRepositoryError('creditCardService', 'creditCardRepository.getByUser')
        return this.repository.getByUser(userId)
    }

    public async create(card: CreditCard) {
        if (!this.repository.create)
            throwRepositoryError('creditCardService', 'creditCardRepository.create')
        validateCard(card)
        return this.repository.create(card)
    }

    public async update(card: CreditCard) {
        if (!this.repository.update)
            throwRepositoryError('creditCardService', 'creditCardRepository.update')
        validateCard(card)
        const cards = await this.repository.getByUser(card.userId)
        if (!cards.filter(p => p.id === card.id).length)
            throwValidationError('Cartão não localizado.')
        return this.repository.update(card)
    }

    public async remove(card: CreditCard) {
        if (!this.repository.remove)
            throwRepositoryError('creditCardService', 'creditCardRepository.remove')
        const cards = await this.repository.getByUser(card.userId)
        if (!cards.filter(p => p.id === Number(card.id)).length)
            throwValidationError('Cartão não localizado.')
        return this.repository.remove(card)
    }
}