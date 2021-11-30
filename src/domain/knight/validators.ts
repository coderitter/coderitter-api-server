import { MariaTransaction } from 'knight-maria-transaction'
import { Absent, Exists, Max, Required, TypeOf, Validator } from 'knight-validation'
import KnightLogic from './KnightLogic'
import Knight, { Adress } from './Knight'

export class KnightValidator extends Validator {

    constructor(tx: MariaTransaction) {
        super()

        this.add('name', new Required)
        this.add('name', new TypeOf('string'))
        this.add('name', new Max(40))

        this.add('adress', new Required)
        this.add('adress', new TypeOf(Adress))
    }
}

export class KnightIdValidator extends Validator {

    knightLogic: KnightLogic

    constructor(knightLogic: KnightLogic, tx: MariaTransaction) {
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

export class KnightCreateValidator extends Validator {

    constructor(tx: MariaTransaction) {
        super()

        this.add('id', new Absent)
        this.add(new KnightValidator(tx))
    }
}

export class KnightUpdateValidator extends Validator {

    constructor(knightLogic: KnightLogic, tx: MariaTransaction) {
        super()

        this.add(new KnightIdValidator(knightLogic, tx))
        this.add(new KnightValidator(tx))
    }
}

export class KnightDeleteValidator extends Validator {

    constructor(knightLogic: KnightLogic, tx: MariaTransaction) {
        super()

        this.add(new KnightIdValidator(knightLogic, tx))
    }
}
