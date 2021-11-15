import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { Log } from 'knight-log'
import { ChangeSendingTransaction } from '../domain/ChangeSendingTransaction'
import Services from '../Services'
import WebSocketApi from './WebSocketApi'

let log = new Log('ApiV1.ts')

export default class Api extends RemoteMethodApi {

    webSocketApi!: WebSocketApi

    start() {
        this.methods = {
        }
    }

    chgTx(): ChangeSendingTransaction {
        let l = log.mt('chgTx')
        return new ChangeSendingTransaction(Services.get().changeLogic, this.webSocketApi)
    }
}