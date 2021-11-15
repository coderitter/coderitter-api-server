import { Absent, Enum, Required, TypeOf, Validator } from 'knight-validation'

export class ChangeValidator extends Validator {
    constructor() {
        super()

        this.add('version', new Absent())

        this.add('entityName', new Required())
        this.add('entityName', new TypeOf('string'))
        this.add('entityName', new Enum())

        this.add('method', new Required())
        this.add('method', new TypeOf('object'))

        this.add('entity', new Required())
        this.add('entity', new TypeOf('object'))
    }
}
