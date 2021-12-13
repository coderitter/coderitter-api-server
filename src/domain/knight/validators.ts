import { PgTransaction } from 'knight-pg-transaction'
import { Absent, Exists, Max, Required, TypeOf, Validator } from 'knight-validation'
import KnightLogic from './KnightLogic'
import Knight, { Address } from './Knight'

export class KnightValidator extends Validator {

    constructor() {
        super()

        this.add('name', new Required)
        this.add('name', new TypeOf('string'))
        this.add('name', new Max(40))

        this.add('address', new Required)
        this.add('address', new TypeOf(Address))
    }
}

export class KnightIdValidator extends Validator {

    knightLogic: KnightLogic

    constructor(knightLogic: KnightLogic, tx: PgTransaction) {
        super()
        this.knightLogic = knightLogic

        this.add('id', new Required)
        this.add('id', new TypeOf('number'))
        this.add('id', new Exists(async (knight: Knight) => {
            let result = await this.knightLogic.count({ id : knight.id }, tx)
            return result.count == 1
        }))
    }
}

export class KnightStoreValidator extends Validator {

    constructor() {
        super()

        this.add(new KnightValidator())
    }
}

export class KnightDeleteValidator extends Validator {

    constructor(knightLogic: KnightLogic, tx: PgTransaction) {
        super()

        this.add(new KnightIdValidator(knightLogic, tx))
    }
}
