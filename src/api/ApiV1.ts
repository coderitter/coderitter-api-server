import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import Log from 'knight-log'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
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
        let l = log.mt('tx')
        return new PgTransaction(this.pool)
    }

    chgTx(): ChangeSendingTransaction {
        let l = log.mt('chgTx')
        return new ChangeSendingTransaction(this.pool, Services.get().changeLogic, this.webSocketApi)
    }
}