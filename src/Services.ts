import http from 'http'
import { Log } from 'knight-log'
import { Pool } from 'mariadb'
import mariadb from 'mariadb'
import ApiV1 from './api/ApiV1'
import HttpApi from './api/HttpApi'
import { getConfigByArgvOrEnvOrDefault, test } from './config'
import DbMigration from './domain/DbMigration'
import DemoData from './domain/DemoData'
import instantiator from './Instantiator'
import KnightLogic from './domain/knight/KnightLogic'
import { Orm } from 'knight-orm'
import { schema } from './domain/DbSchema'

let log = new Log('Services.ts')

export default class Services {
    private static _instance: Services = new Services()

    static get(): Services {
        return Services._instance
    }

    config = getConfigByArgvOrEnvOrDefault()

    pool!: Pool

    httpServer!: http.Server

    apiV1 = new ApiV1()
    httpApi!: HttpApi

    orm = new Orm(schema, 'mariadb')

    knightLogic = new KnightLogic()

    async start() {
        log.admin('Starting services...')

        await this.startDb()
        await this.startServer()

        this.inject()
        this.startApis()
    }

    inject() {
        this.knightLogic.orm = this.orm
    }

    async startDb() {
        this.pool = mariadb.createPool(this.config.db)
        log.admin(
            'Created database connection pool',
            'Config =',
            this.config.db
        )
    }

    async startServer() {
        // HTTP Server
        this.httpServer = http.createServer()
    }

    startApis() {
        this.httpApi = new HttpApi(
            this.apiV1,
            instantiator,
            this.config.httpApi
        )
        this.httpApi.server = this.httpServer

        this.apiV1.pool = this.pool

        this.httpApi.start()
        log.admin('Started HTTP API (POSTonly)')

        log.admin(
            'Initialized HTTP API with remote methods',
            this.apiV1.methodNames
        )
    }

    async stop() {
        log.admin('Stopping services...')

        if (this.pool) {
            this.pool.end()
            log.admin('Stopped database connections')
        }

        if (this.httpServer) {
            this.httpServer.close()
            log.admin('Stopped HTTP server')
        }

        Log.watcher?.close()
    }

    useTestConfig() {
        log.admin('Using test config')
        this.config = test
    }

    get dbMigration(): DbMigration {
        return new DbMigration(this.pool, this.config.db.database)
    }

    get demoData(): DemoData {
        return new DemoData(this.pool, this.knightLogic)
    }
}
