import { Schema } from 'knight-orm'
import Knight from './knight/Knight'

export const schema = new Schema

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
