import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'

let log = new Log('DemoData.ts')

export default class DemoData {
    pool: Pool

    constructor(pool: Pool) {
        this.pool = pool
    }

    async create() {
        log.admin('Creating demo data...')

        let tx = new MariaTransaction(this.pool)
    }
}
