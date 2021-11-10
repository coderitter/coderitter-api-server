import Log from 'knight-log'
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
      CREATE TABLE Change (
        version SERIAL PRIMARY KEY,
        entityName VARCHAR(100),
        method VARCHAR(20),
        entity TEXT,
        description TEXT
      )`
        )

        await this.increaseVersion()
        log.admin('Migrated to version 1 (Add change table)')
    }
}
