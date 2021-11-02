import http from 'http'
import Log from 'knight-log'
import { Pool } from 'pg'
import WebSocket from 'ws'
import ApiV1 from './api/ApiV1'
import HttpApi from './api/HttpApi'
import WebSocketApi from './api/WebSocketApi'
import { getConfigByArgvOrEnvOrDefault, test } from './config'
import ChangeLogic from './domain/change/ChangeLogic'
import DbMigration from './domain/DbMigration'
import DemoData from './domain/DemoData'
import instantiator from './Instantiator'

let log = new Log('Services.ts')

/**
 * 
 */
export default class Services {

  private static instance: Services = new Services()

  static get(): Services {
    return Services.instance
  }
  
  config = getConfigByArgvOrEnvOrDefault()

  pool!: Pool

  httpServer!: http.Server
  webSocketServer!: WebSocket.Server

  apiV1 = new ApiV1
  httpApi!: HttpApi
  webSocketApi!: WebSocketApi

  changeLogic = new ChangeLogic

  async start() {
    log.admin('Starting services...')

    await this.startDb()
    await this.startServer()

    this.inject()
    this.startApis()
  }

  inject() {
  }

  async startDb() {
    this.pool = new Pool(this.config.db)
    log.admin('Created database connection pool', 'Config =', this.config.db)
  }

  async startServer() {
    // HTTP Server
    this.httpServer = http.createServer()

    // WebSocket Server          
    this.webSocketServer = new WebSocket.Server({
      server: this.httpServer
    }, () => {
      let address = this.webSocketServer.address() as any
      log.admin('WebSocket server running at ' + address.address + ':' + address.port + ' - ' + address.family)
    })
  }

  startApis() {
    this.httpApi = new HttpApi(this.apiV1, instantiator, this.config.httpApi)
    this.httpApi.server = this.httpServer

    this.webSocketApi = new WebSocketApi
    this.webSocketApi.webSocketServer = this.webSocketServer
    this.webSocketApi.pool = this.pool
    this.webSocketApi.changeLogic = this.changeLogic

    this.apiV1.pool = this.pool
    this.apiV1.webSocketApi = this.webSocketApi

    this.httpApi.start()
    log.admin('Started HTTP API (POSTonly)')
    this.webSocketApi.start()
    log.admin('Started WebSocket API')

    log.admin('Initialized HTTP API with remote methods', this.apiV1.methodNames)
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

    if (this.webSocketServer) {
      this.webSocketServer.close()
      log.admin('Stopped WebSocket server')  
    }

    Log.watcher?.close()
  }

  useTestConfig() {
    log.admin('Using test config')
    this.config = test
  }

  get dbMigration(): DbMigration {
    return new DbMigration(this.pool)
  }

  get demoData(): DemoData {
    return new DemoData(this.pool)
  }
}
