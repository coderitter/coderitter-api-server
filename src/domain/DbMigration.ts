import { Log } from 'knight-log'
import { PostgresMigration } from 'knight-pg-migration'
import { Pool } from 'pg'

let log = new Log('DbMigration.ts')

export default class DbMigration extends PostgresMigration {

    constructor(pool: Pool) {
        super(pool)
    }

    async migrate() {
        log.admin('Starting database migration...')
        await this.version1()
    }

    async version1() {
        if (await this.getVersion() >= 1) {
            log.admin('Skipping version 1')
            return
        }

        await this.pool.query(`
            create table knight(
                id SERIAL PRIMARY KEY,
                name VARCHAR(40),
                address VARCHAR(200)
            );`)

        await this.increaseVersion()
        log.admin('Migrated to version 1 (Add table knight)')
    }
}
