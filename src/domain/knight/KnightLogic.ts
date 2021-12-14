import { Result } from 'coderitter-api-remote-method-call'
import { Criteria } from 'knight-criteria'
import { Log } from 'knight-log'
import { Orm } from 'knight-orm'
import Knight from './Knight'
import { MariaTransaction } from 'knight-maria-transaction'
import { EntityResult, EntitiesResult, CountResult } from '../api'
import { txQuery } from '../../util/transactions'
import { KnightStoreValidator, KnightDeleteValidator } from './validators'

let log = new Log('KnightLogic.ts')

export default class KnightLogic {
    orm!: Orm

    async storeIfNotAlreadyExist(knight: Knight, tx: MariaTransaction){
        let l = log.mt('storeIfNotAlreadyExist')
        l.param('knight', knight)

        let alreadyExist = await this.read(knight, tx)
        if(alreadyExist.entities.length === 0){
            let result = await this.store(knight, tx)
            l.dev('created knight', result)
        }
        else{
            l.admin('demo data already exists.. skipping..')
        }
    }

    async store(knight: Knight, tx: MariaTransaction): Promise<EntityResult<Knight>> {
        let l = log.mt('store')
        l.param('knight', knight)

        return tx.runInTransaction(async () => {
            let validator = new KnightStoreValidator(this, tx)
            let misfits = await validator.validate(knight)
            l.dev('Validation yields the following misfits', misfits)

            if (misfits.length > 0) {
                await tx.rollback()
                return Result.misfits(misfits) as any
            }

            let stored = await this.orm.store(txQuery(tx), Knight, knight)
            l.dev('stored', stored)

            return new EntityResult(stored)
        })
    }

    async read(criteria: Criteria = {}, tx: MariaTransaction): Promise<EntitiesResult<Knight>> {
        let l = log.mt('read')
        l.param('criteria', criteria)

        return tx.runInTransaction(async () => {
            let knights: Knight[] = await this.orm.read(txQuery(tx), Knight, criteria)
            l.dev('knights', knights)

            return new EntitiesResult(knights)
        })
    }

    async count(criteria: Criteria = {}, tx: MariaTransaction): Promise<CountResult> {
        let l = log.mt('count')
        l.param('parameter', criteria)
    
        return tx.runInTransaction(async () => {
            let count = await this.orm.count(txQuery(tx), Knight, criteria)
            l.dev('count', count)
            return new CountResult(count)
        })
    }
    

    async delete(knight: Partial<Knight>, tx: MariaTransaction): Promise<EntityResult<Knight>> {
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

            let deleted = await this.orm.delete(txQuery(tx), Knight, knight)
            l.dev('deleted', deleted)

            return new EntityResult(deleted)
        })
    }
}
