import Log from 'knight-log'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'

let log = new Log('DemoData.ts')

export default class DemoData {

    pool: Pool

    constructor(pool: Pool) {
        this.pool = pool
    }

    async create() {
        log.admin('Creating demo data...')

        let tx = new PgTransaction(this.pool)

    }
}