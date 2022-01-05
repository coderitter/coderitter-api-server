import { Schema } from 'knight-orm'
import Change from './change/Change'

export const schema = new Schema

schema.addTable('change', {
    columns: {
        'version': { property: 'version', primaryKey: true, generated: true },
        'entityname': 'entityName',
        'method': 'method',
        'entity': 'entity'
    },
    relationships: {},
    newInstance: () => new Change
}
)

schema.check()
