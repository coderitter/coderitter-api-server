import { Result } from 'coderitter-api-remote-method-call'

export class EntityResult<T> extends Result {

    entity: T

    constructor(entity?: T) {
        super()
        this.entity = entity as any
    }
}

export class EntityOrNullResult<T> extends Result {

    entity?: T

    constructor(entity?: T) {
        super()
        this.entity = entity
    }
}

export class EntitiesResult<T> extends Result {

    entities: T[]

    constructor(entities?: T[]) {
        super()

        this.entities = entities as any
    }
}

export class EntitiesVersionResult<T> extends EntitiesResult<T> {

    version: number

    constructor(entities?: T[], version?: number) {
        super(entities)

        this.version = version as any
    }
}

export class CreateOrGetResult<T> extends EntityResult<T> {

    created?: boolean

    constructor(entity?: T, created?: boolean) {
        super(entity)

        this.created = created
    }
}

export class CountResult extends Result {

    count: number

    constructor(count?: number) {
        super()

        this.count = count as any
    }
}