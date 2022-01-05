import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import { Log } from 'knight-log'

import { ChangeSendingTransaction } from '../domain/ChangeSendingTransaction'
import Services from '../Services'
import WebSocketApi from './WebSocketApi'

let log = new Log('ApiV1.ts')

export default class Api extends RemoteMethodApi {

    pool!: Pool
    webSocketApi!: WebSocketApi

    start() {
        this.methods = {
        }
    }

    tx(): PgTransaction {
        return new PgTransaction(this.pool)
    }

    chgTx(): ChangeSendingTransaction {
        log.fn('chgTx')
        return new ChangeSendingTransaction(this.pool, Services.get().changeLogic, this.webSocketApi)
    }
}