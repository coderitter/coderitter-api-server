import { Result } from 'coderitter-api-remote-method-call'
import { Changes } from 'knight-change'
import { CountResult, CreateOrGetResult, EntitiesResult, EntitiesVersionResult, EntityResult } from './domain/api'
import Knight from './domain/knight/Knight'

export default {
    // change
    'Changes': () => new Changes,

    //knight
    'Knight': () => new Knight,

    // Common results
    'Result': () => new Result,
    'EntityResult': () => new EntityResult,
    'EntitiesResult': () => new EntitiesResult,
    'EntitiesVersionResult': () => new EntitiesVersionResult,
    'CreateOrGetResult': () => new CreateOrGetResult,
    'CountResult': () => new CountResult

} as { [className: string]: () => any }