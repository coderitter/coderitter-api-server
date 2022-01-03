import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'
import { ChangeSendingTransaction } from '../domain/ChangeSendingTransaction'
import Services from '../Services'
import WebSocketApi from './WebSocketApi'

let log = new Log('ApiV1.ts')

export default class Api extends RemoteMethodApi {
    pool!: Pool
    webSocketApi!: WebSocketApi

    start() {
        this.methods = {}
    }

    tx(): MariaTransaction {
        return new MariaTransaction(this.pool)
    }

    chgTx(): ChangeSendingTransaction {
        log.mt('chgTx')
        return new ChangeSendingTransaction(
            this.pool,
            Services.get().changeLogic,
            this.webSocketApi
        )
    }
}
