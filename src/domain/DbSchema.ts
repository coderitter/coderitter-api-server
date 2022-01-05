import { Schema } from 'knight-orm'
import Change from './change/Change'
import Knight from './knight/Knight'

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

schema.addTable('knight', {
    columns: {
        'id': { property: 'id', primaryKey: true, generated: true },
        'name': 'name',
        'address': 'address'
    },
    relationships: {},
    newInstance: () => new Knight,
    instanceToRow: (knight: Knight, row: any) => {
        row.address = JSON.stringify(knight.address)
    },
    rowToInstance: (row: any, knight: Knight) => {
        knight.address = JSON.parse(row.address)
    }
})

schema.check()
