import { Log } from 'knight-log'
import { Pool } from 'mariadb'
import { MariaMigration } from 'knight-maria-migration'

let log = new Log('DbMigration.ts')

export default class DbMigration extends MariaMigration {
    constructor(pool: Pool, database: string) {
        super(pool, database)
    }

    async migrate() {
        log.admin('Starting database migration...')
        await this.version1()
    }

    async version1() {
        if ((await this.getVersion()) >= 1) {
            log.admin('Skipping version 1')
            return
        }

        try {
            await this.pool.query(`
                create table knight(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(40),
                    address VARCHAR(200)
                );`)
        }
        catch (e) {
            throw new Error(<any>e)
        }

        await this.increaseVersion()
        log.admin('Migrated to version 1 (Add knight table)')
    }
}
