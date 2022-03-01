import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import { Log } from 'knight-log'

import Services from '../Services'

let log = new Log('ApiV1.ts')

export default class Api extends RemoteMethodApi {

    pool!: Pool

    start() {
        this.methods = {
        }
    }

    tx(): PgTransaction {
        return new PgTransaction(this.pool)
    }
}