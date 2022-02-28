import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'

let log = new Log('ApiV1.ts')

export default class Api extends RemoteMethodApi {
    pool!: Pool

    start() {
        this.methods = {}
    }

    tx(): MariaTransaction {
        return new MariaTransaction(this.pool)
    }
}
