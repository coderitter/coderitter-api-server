import { Result } from 'coderitter-api-remote-method-call'
import { Changes } from 'knight-change'
import {
    CountResult,
    CreateOrGetResult,
    EntitiesResult,
    EntitiesVersionResult,
    EntityResult
} from './domain/api'
import Change from './domain/change/Change'

export default {
    // change
    Changes: () => new Changes(),
    Change: () => new Change(),

    // Common results
    Result: () => new Result(),
    EntityResult: () => new EntityResult(),
    EntitiesResult: () => new EntitiesResult(),
    EntitiesVersionResult: () => new EntitiesVersionResult(),
    CreateOrGetResult: () => new CreateOrGetResult(),
    CountResult: () => new CountResult()
} as { [className: string]: () => any }
