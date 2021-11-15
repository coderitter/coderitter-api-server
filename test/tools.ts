import { Criteria, ReadCriteria } from 'knight-criteria'
import {
    count as crudCount,
    create as crudCreate,
    read as crudRead
} from 'knight-orm'
import { MariaTransaction } from 'knight-maria-transaction'
import { Misfit } from 'knight-validation'
import schema from '../src/domain/DbSchema'
import Services from '../src/Services'

export function tx() {
    return new MariaTransaction(Services.get().pool)
}

export function create(tableName: string, instance: any = {}) {
    return crudCreate(schema, tableName, 'mysql', queryFn, instance)
}

export function read<T>(tableName: string, criteria: ReadCriteria = {}) {
    return crudRead<T>(schema, tableName, 'mysql', queryFn, criteria)
}

export function count(tableName: string, criteria: Criteria = {}) {
    return crudCount(schema, tableName, 'mysql', queryFn, criteria)
}

export async function queryFn(sqlString: string, values?: any[]) {
    let tx = new MariaTransaction(Services.get().pool)
    let result = await tx.query(sqlString, values)
    return result.rows
}

export function containsMisfit(
    field: string,
    misfitType: string,
    misfits: Misfit[]
): boolean {
    for (let misfit of misfits) {
        if (misfit.field == field && misfit.name == misfitType) {
            return true
        }
    }

    return false
}
