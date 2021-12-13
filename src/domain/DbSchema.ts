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
        'addres': 'addres'
    },
    relationships: {},
    newInstance: () => new Knight,
    instanceToRow: (knight: Knight, row: any)=>{
        row.addres = JSON.stringify(knight.addres)
        return row
    },
    rowToInstance: (row: any, knight: Knight) =>{
        knight.addres = JSON.parse(row.addres)
        return knight
    } 
})

schema.check()