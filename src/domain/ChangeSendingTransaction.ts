import Log from 'knight-log'
import WebSocketApi from '../api/WebSocketApi'
import ChangeLogic from '../domain/change/ChangeLogic'

let log = new Log('ChangeSendingTransaction.ts')

export class ChangeSendingTransaction {

    versionBefore?: number
  
    constructor( changeLogic: ChangeLogic, webSocketApi: WebSocketApi) {
    }
}
