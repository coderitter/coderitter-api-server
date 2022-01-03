import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'

let log = new Log('transactions.ts')

export class ChangeSendingTransaction extends MariaTransaction {

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

export function txQuery(tx: MariaTransaction): (sqlString: string, values?: any[]) => Promise<any> {
    return async (sqlString: string, values?: any) => {
        return tx.query(sqlString, values)
    }
}
