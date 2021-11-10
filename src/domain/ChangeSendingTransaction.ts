import Log from 'knight-log'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import WebSocketApi from '../api/WebSocketApi'
import ChangeLogic from '../domain/change/ChangeLogic'

let log = new Log('ChangeSendingTransaction.ts')

export class ChangeSendingTransaction extends PgTransaction {

    versionBefore?: number
  
    constructor(pool: Pool, changeLogic: ChangeLogic, webSocketApi: WebSocketApi) {
        super(pool)

        this.afterBegin(async () => {
            let l = log.fn('onAfterBegin')
            this.versionBefore = await changeLogic.latestVersion(this)
            l.var('this.versionBefore', this.versionBefore)
        })

        this.afterCommit(() => {
            if (this.versionBefore) {
                webSocketApi.sendChanges(this.versionBefore)
            }
        })
    }
}
