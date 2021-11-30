import { fromJson, toJson } from 'knight-json'
import { Schema } from 'knight-orm'
import instantiator from '../Instantiator'
import Change from './change/Change'
import Knight from './knight/Knight'

export default {
    'change': {
        columns: {
            'version': { property: 'version', id: true },
            'entityname': 'entityName',
            'method': 'method',
            'entity': 'entity'
        },
        rowToInstance: (row: any) => {
            let change = new Change

            change.version = row['version']
            change.entityName = row['entityname']
            change.method = row['method'] != null ? JSON.parse(row['method']) : row['method']

            if (row['entity'] != null) {
                change.entity = fromJson(row['entity'], { instantiator: instantiator })
            }
    
            return change
        },
        instanceToRow: (change: Change) => {
            return {
                version: change.version,
                entityname: change.entityName,
                method: change.method != undefined ? JSON.stringify(change.method) : undefined,
                entity: toJson(change.entity)
            }
        }
    },
    'knight':{
        columns:{
            'id': {property: 'id', id: true},
            'name': 'name',
            'adress': 'adress'
        },
        rowToInstance: (row: any) => {
            let knight = new Knight

            knight.id = row['id']
            knight.name = row['name']
            knight.adress = row['adress'] != null ? JSON.parse(row['adress']) : row['adress']

            return knight
        },
        instanceToRow: (knight: Knight) => {
            return {
                id: knight.id,
                name: knight.name,
                adress: knight.adress != undefined ? JSON.stringify(knight.adress) : undefined
            }
        }
    }
} as Schema
