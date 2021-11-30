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
        let l = log.mt('version1')
        if ((await this.getVersion()) >= 1) {
            log.admin('Skipping version 1')
            return
        }

        try {
            await this.pool.query(`
      create table onchange(
          version int auto_increment,
          entityName varchar(100),
          method varchar(20),
          entity text,
          description text,
          primary key (version)
        );`)

            await this.pool.query(`
        create table knight(
            id int auto_increment primary key,
            name varchar(40),
            adress varchar(200)
          );`)
        }
        catch (e) {
            throw new Error(<any>e)
        }

        await this.increaseVersion()
        log.admin('Migrated to version 1 (Add onchange and knight table)')
    }
}
