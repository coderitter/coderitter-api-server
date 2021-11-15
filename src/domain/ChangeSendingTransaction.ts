import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'
import WebSocketApi from '../api/WebSocketApi'
import ChangeLogic from '../domain/change/ChangeLogic'

let log = new Log('ChangeSendingTransaction.ts')

export class ChangeSendingTransaction extends MariaTransaction {
    versionBefore?: number

    constructor(
        pool: Pool,
        changeLogic: ChangeLogic,
        webSocketApi: WebSocketApi
    ) {
        super(pool)

        this.afterBegin(async () => {
            let l = log.fn('onAfterBegin')
            this.versionBefore = await changeLogic.latestVersion(this)
            l.dev('this.versionBefore', this.versionBefore)
        })

        this.afterCommit(() => {
            if (this.versionBefore) {
                webSocketApi.sendChanges(this.versionBefore)
            }
        })
    }
}
