import { Changes } from 'knight-change'
import { toJson } from 'knight-json'
import Log from 'knight-log'
import WebSocket from 'ws'
import ChangeLogic from '../domain/change/ChangeLogic'

let log = new Log('WebSocketApi.ts')

export default class WebSocketApi {

    webSocketServer!: WebSocket.Server
    changeLogic!: ChangeLogic

    lastVersion?: number
    sendingChanges = false
    pingInterval?: NodeJS.Timeout

    start() {
        this.webSocketServer.on('connection', (socket, request) => {
            let l = log.fn('onConnection')
            l.user('New WebSocket connection from ' + request.connection.remoteAddress)

            socket.on('message', (data: WebSocket.Data) => {
                let l = log.fn('onMessage')

                if (typeof data == 'string') {
                    l.var('data', data)

                    if (data == 'pong') {
                        l.user('Received pong...')
                        ;(socket as any).isAlive = true
                    }
                    else {
                        l.user('Received version number...')
                        let version = parseInt(data)
                        l.var('version', version)

                        if (isNaN(version)) {
                            l.error('Received version is not a number. Returning...')
                            return
                        }
  
                        l.user('Received version. Sending changes...')
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
                l.user('No connected clients. Returning...')
                return
            }

            for (let client of this.webSocketServer.clients) {
                if ((client as any).isAlive === false) {
                    l.user('Found dead client. Terminating...')
                    client.terminate()
                    continue
                }

                ;(client as any).isAlive = false
                l.user('Pinging client...')
                client.send('ping')
            }
        }, 30000)
    }

    async sendChanges(lastVersion: number, client?: WebSocket) {
        let l = log.mt('sendChanges')
        l.var('versionBefore', lastVersion)

        l.user('Retrieving all changes since the last ones...')

        let changeReadResult
        try {
            changeReadResult = await this.changeLogic.read({ version: { operator: '>', value: lastVersion }, '@orderBy': 'version' }/*, new PgTransaction(this.pool)*/)
        }
        catch (e) {
            l.error(e)
            throw new Error(<any>e)
        }

        l.var('changeReadResult', changeReadResult)

        let changes = new Changes

        let clients: WebSocket[]
        if (client != undefined) {
            if (! (client as any).sendingChanges) {
                l.user('Using single given WebSocket client...')
                clients = [ client ]
            }
            else {
                l.user('Client is already sending changes. Returning...')
                return
            }
        }
        else {
            l.user('Using all clients which are not sending...')

            clients = []
            for (let client of this.webSocketServer.clients) {
                if ((client as any).sendingChanges) {
                    l.user('Client is already sending changes. Continuing...')
                    continue
                }
  
                (client as any).sendingChanges = true
                clients.push(client)
            }  
        }


        l.user('Converting changes to json...')
        let changesJson = toJson(changes)
        l.var('changesJson', changesJson)

        l.user('Sending changes to every client...')

        for (let client of clients) {
            l.var('client', (client as any)._socket._peername.address)

            client.send(changesJson, (e: Error|undefined) => {
                if (e != undefined) {
                    l.error(e)
                }
            })
        }

        l.user('Setting all clients to not sending...')

        for (let client of clients) {
            (client as any).sendingChanges = false
        }
    }
}
