import { Change as KnightChange, Method } from 'knight-change'

export default class Change extends KnightChange {
  
    version?: number

    constructor()
    constructor(entity: object)
    constructor(entity: object, method: string)
    constructor(entity: object, method: Method)
    constructor(entity: object, methods: ( string | Method )[])
    constructor(entityName: string)
    constructor(entityName: string, entity: object)
    constructor(entityName: string, entity: object, method: string)
    constructor(entityName: string, entity: object, method: Method)
    constructor(entityName: string, entity: object, methods: ( string | Method )[])
    constructor(entityName: string, method: string)
    constructor(entityName: string, method: Method)
    constructor(entityName: string, methods: ( string | Method )[])
    constructor(classFunction: { new(): any })
    constructor(classFunction: { new(): any }, entity: object)
    constructor(classFunction: { new(): any }, entity: object, method: string)
    constructor(classFunction: { new(): any }, entity: object, method: Method)
    constructor(classFunction: { new(): any }, entity: object, methods: ( string | Method )[])
    constructor(classFunction: { new(): any }, method: string)
    constructor(classFunction: { new(): any }, method: Method)
    constructor(classFunction: { new(): any }, methods: ( string | Method )[])

    constructor(arg1?: any, arg2?: any, arg3?: any) {
        super(arg1, arg2, arg3)
    }
}