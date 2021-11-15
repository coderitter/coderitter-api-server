import { Changes } from 'knight-change'
import { toJson } from 'knight-json'
import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import { Log } from 'knight-log'
import WebSocket from 'ws'
import ChangeLogic from '../domain/change/ChangeLogic'

let log = new Log('WebSocketApi.ts')

export default class WebSocketApi {

    webSocketServer!: WebSocket.Server
    pool!: Pool
    changeLogic!: ChangeLogic

    lastVersion?: number
    sendingChanges = false
    pingInterval?: NodeJS.Timeout

    start() {
        this.webSocketServer.on('connection', (socket, request) => {
            let l = log.fn('onConnection')
            l.admin('New WebSocket connection from ' + request.connection.remoteAddress)

            socket.on('message', (data: WebSocket.Data) => {
                let l = log.fn('onMessage')

                if (typeof data == 'string') {
                    l.dev('data', data)

                    if (data == 'pong') {
                        l.admin('Received pong...')
                        ;(socket as any).isAlive = true
                    }
                    else {
                        l.admin('Received version number...')
                        let version = parseInt(data)
                        l.dev('version', version)

                        if (isNaN(version)) {
                            l.error('Received version is not a number. Returning...')
                            return
                        }
  
                        l.admin('Received version. Sending changes...')
                        this.sendChanges(version, socket)  
                    }
                }
            })
        })

        this.webSocketServer.on('close', () => {
            if (this.pingInterval) {
                clearInterval(this.pingInterval)
            }
        })

        this.webSocketServer.on('error', error => {
            log.error('WebSocket error ' + error.message)
        })

        this.pingInterval = setInterval(() => {
            let l = log.fn('onPingInterval')

            if (this.webSocketServer.clients.size == 0) {
                l.admin('No connected clients. Returning...')
                return
            }

            for (let client of this.webSocketServer.clients) {
                if ((client as any).isAlive === false) {
                    l.admin('Found dead client. Terminating...')
                    client.terminate()
                    continue
                }

                ;(client as any).isAlive = false
                l.admin('Pinging client...')
                client.send('ping')
            }
        }, 30000)
    }

    async sendChanges(lastVersion: number, client?: WebSocket) {
        let l = log.mt('sendChanges')
        l.dev('versionBefore', lastVersion)

        l.admin('Retrieving all changes since the last ones...')

        let changeReadResult
        try {
            changeReadResult = await this.changeLogic.read({ version: { operator: '>', value: lastVersion }, '@orderBy': 'version' }, new PgTransaction(this.pool))
        }
        catch (e) {
            l.error(e)
            throw new Error(<any>e)
        }

        l.dev('changeReadResult', changeReadResult)

        let changes = new Changes
        changes.changes = changeReadResult.entities

        let clients: WebSocket[]
        if (client != undefined) {
            if (! (client as any).sendingChanges) {
                l.admin('Using single given WebSocket client...')
                clients = [ client ]
            }
            else {
                l.admin('Client is already sending changes. Returning...')
                return
            }
        }
        else {
            l.admin('Using all clients which are not sending...')

            clients = []
            for (let client of this.webSocketServer.clients) {
                if ((client as any).sendingChanges) {
                    l.admin('Client is already sending changes. Continuing...')
                    continue
                }
  
                (client as any).sendingChanges = true
                clients.push(client)
            }  
        }


        l.admin('Converting changes to json...')
        let changesJson = toJson(changes)
        l.dev('changesJson', changesJson)

        l.admin('Sending changes to every client...')

        for (let client of clients) {
            l.dev('client', (client as any)._socket._peername.address)

            client.send(changesJson, (e: Error|undefined) => {
                if (e != undefined) {
                    l.error(e)
                }
            })
        }

        l.admin('Setting all clients to not sending...')

        for (let client of clients) {
            (client as any).sendingChanges = false
        }
    }
}
