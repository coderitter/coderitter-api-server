import { Log } from 'knight-log'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'

let log = new Log('transactions.ts')

export class ChangeSendingTransaction extends PgTransaction {

    versionBefore?: number
  
    constructor(pool: Pool) {
        super(pool)

        this.afterBegin(async () => {
            let l = log.fn('onAfterBegin')
            l.dev('this.versionBefore', this.versionBefore)
        })

        this.afterCommit(() => {
        })
    }
}

export function txQuery(tx: PgTransaction): (sqlString: string, values?: any[]) => Promise<any[]> {
    return async (sqlString: string, values?: any[]) => {
        let result = await tx.query(sqlString, values)
        return result.rows
    }
}
