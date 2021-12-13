import { Schema } from 'knight-orm'
import Change from './change/Change'
import Knight from './knight/Knight'

export const schema = new Schema

schema.addTable('onchange',{
    columns:{
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
    columns:{
        'id': {property: 'id', primaryKey: true, generated: true },
        'name': 'name',
        'adress': 'adress'
    },
    relationships: {},
    newInstance: () => new Knight, 
    instanceToRow: (knight: Knight, row:any) => {
        row.adress = JSON.stringify(knight.adress)
        return row
    },
    rowToInstance: (row: any, knight: Knight) => {
        knight.adress = JSON.parse(row.adress)
        return knight
    }
})

schema.check()