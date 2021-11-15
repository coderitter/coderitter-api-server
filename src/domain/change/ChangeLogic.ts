import { Result } from 'coderitter-api-remote-method-call'
import { ReadCriteria } from 'knight-criteria'
import { Log } from 'knight-log'
import { create, read } from 'knight-orm'
import { MariaTransaction } from 'knight-maria-transaction'
import { EntitiesResult, EntityResult } from '../api'
import schema from '../DbSchema'
import { txQuery } from '../txQuery'
import Change from './Change'
import { ChangeValidator } from './validators'

let log = new Log('ChangeLogic.ts')

export default class ChangeLogic {
    async create(
        change: Change,
        tx: MariaTransaction
    ): Promise<EntityResult<Change>> {
        let l = log.mt('create')
        l.param('change', change)

        return tx.runInTransaction(async () => {
            let validator = new ChangeValidator()
            let misfits = await validator.validate(change)
            l.dev('misfits', misfits)

            if (misfits.length > 0) {
                await tx.rollback()
                return Result.misfits(misfits) as any
            }

            let createdChange = await create(
                schema,
                'change',
                'mysql',
                txQuery(tx),
                change
            )

            return new EntityResult(createdChange)
        })
    }

    async read(
        criteria: ReadCriteria = {},
        tx: MariaTransaction
    ): Promise<EntitiesResult<Change>> {
        let l = log.mt('read')
        l.param('criteria', criteria)

        return tx.runInTransaction(async () => {
            let changes: Change[] = await read(
                schema,
                'change',
                'mysql',
                txQuery(tx),
                criteria
            )

            l.dev('changes', changes)
            return new EntitiesResult(changes)
        })
    }

    async latestVersion(tx: MariaTransaction): Promise<number> {
        let l = log.mt('latestVersion')

        return tx.runInTransaction(async () => {
            let dbResult = await tx.query('SELECT max(version) FROM change')
            l.dev('dbResult.rows', dbResult.rows)
            let latestVersion =
                dbResult.rows[0].max === null ? undefined : dbResult.rows[0].max
            l.dev('latestVersion', latestVersion)
            return latestVersion || 0
        })
    }
}
