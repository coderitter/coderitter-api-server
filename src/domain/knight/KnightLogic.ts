import { Result } from 'coderitter-api-remote-method-call'
import { ReadCriteria, Criteria } from 'knight-criteria'
import { Log } from 'knight-log'
import { create, delete_, read, update, count } from 'knight-orm'
import Knight from './Knight'
import { PgTransaction } from 'knight-pg-transaction'
import { EntityResult, EntitiesResult, CreateOrGetResult, CountResult } from '../api'
import schema from '../DbSchema'
import { txQuery } from '../../util/transactions'
import { KnightCreateValidator, KnightDeleteValidator, KnightUpdateValidator } from './validators'

let log = new Log('KnightLogic.ts')

export default class KnightLogic {

    async create(knight: Partial<Knight>, tx: PgTransaction): Promise<CreateOrGetResult<Knight>> {
        let l = log.mt('create')

        return tx.runInTransaction(async () => {
            let validator = new KnightCreateValidator(tx)
            let misfits = await validator.validate(knight)
            l.dev('Validation yields the following misfits', misfits)

            if (misfits.length > 0) {
                await tx.rollback()
                return Result.misfits(misfits) as any
            }

            let created = await create(schema, 'knight', 'mysql', txQuery(tx), knight) as Knight //not working with mariaDB?

            l.dev('created', created)

            let knightCreateResult = new CreateOrGetResult(created)
            l.dev('knightCreateResult', knightCreateResult.entity)
      
            return knightCreateResult
        })
    }

    async read(criteria: ReadCriteria = {}, tx: PgTransaction): Promise<EntitiesResult<Knight>> {
        let l = log.mt('read')
        l.param('criteria', criteria)

        return tx.runInTransaction(async () => {
            let knights: Knight[] = await read(schema, 'knight', 'mysql', txQuery(tx), criteria)// not working with mariaDB?
            l.dev('knights', knights)

            return new EntitiesResult(knights)
        })
    }

    async update(knight: Knight, tx: PgTransaction): Promise<EntityResult<Knight>> {
        let l = log.mt('update')
        l.param('knight', knight)

        return tx.runInTransaction(async () => {
            let validator = new KnightUpdateValidator(this, tx)
            let misfits = await validator.validate(knight)
            l.dev('Validation yields the following misfits', misfits)

            if (misfits.length > 0) {
                await tx.rollback()
                return Result.misfits(misfits) as any
            }

            let updated = await update(schema, 'knight', 'mysql', txQuery(tx), knight) as Knight// not working with mariaDB
            l.dev('updated', updated)

            return new EntityResult(updated)
        })
    }

    async count(criteria: Criteria = {}, tx: PgTransaction): Promise<CountResult> {
        let l = log.mt('count')
        l.param('parameter', criteria)
    
        return tx.runInTransaction(async () => {
            let cnt = await count(schema, 'card', 'mysql', txQuery(tx), criteria)
            l.dev('count', cnt)
            return new CountResult(cnt)
        })
    }
    

    async delete(knight: Partial<Knight>, tx: PgTransaction): Promise<EntityResult<Knight>> {
        let l = log.mt('delete')
        l.param('knight', knight)

        return tx.runInTransaction(async () => {
            let validator = new KnightDeleteValidator(this, tx)
            let misfits = await validator.validate(knight)
            l.dev('Validation yields the following misfits', misfits)

            if (misfits.length > 0) {
                await tx.rollback()
                return Result.misfits(misfits) as any
            }

            let deleted = await delete_(schema, 'knight', 'mysql', txQuery(tx), knight) as Knight // not working with mariaDB
            l.dev('deleted', deleted)

            return new EntityResult(deleted)
        })
    }
}
