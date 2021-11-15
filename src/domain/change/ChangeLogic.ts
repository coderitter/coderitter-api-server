import { ReadCriteria } from 'knight-criteria'
import { Log } from 'knight-log'
import Change from './Change'

let log = new Log('ChangeLogic.ts')

export default class ChangeLogic {

    async create(change: Change): Promise<void> {
        let l = log.mt('create')
        l.param('change', change)
    }

    async read(criteria: ReadCriteria = {}): Promise<void> {
        let l = log.mt('read')
        l.param('criteria', criteria)
    }

    async latestVersion(): Promise<void> {
        let l = log.mt('latestVersion')
    }
}