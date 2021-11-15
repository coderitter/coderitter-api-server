import { fromJson, toJson } from 'knight-json'
import { Schema } from 'knight-orm'
import instantiator from '../Instantiator'
import Change from './change/Change'

export default {
    onchange: {
        columns: {
            version: { property: 'version', id: true },
            entityname: 'entityName',
            method: 'method',
            entity: 'entity'
        },
        rowToInstance: (row: any) => {
            let change = new Change()

            change.version = row['version']
            change.entityName = row['entityname']
            change.method =
                row['method'] != null
                    ? JSON.parse(row['method'])
                    : row['method']

            if (row['entity'] != null) {
                change.entity = fromJson(row['entity'], {
                    instantiator: instantiator
                })
            }

            return change
        },
        instanceToRow: (change: Change) => {
            return {
                version: change.version,
                entityname: change.entityName,
                method:
                    change.method != undefined
                        ? JSON.stringify(change.method)
                        : undefined,
                entity: toJson(change.entity)
            }
        }
    }
} as Schema
