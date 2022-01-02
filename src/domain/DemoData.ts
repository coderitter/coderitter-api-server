import { Log } from 'knight-log'
import { MariaTransaction } from 'knight-maria-transaction'
import { Pool } from 'mariadb'

import Knight, { Address } from './knight/Knight'
import KnightLogic from './knight/KnightLogic'

let log = new Log('DemoData.ts')

export default class DemoData {
    pool: Pool
    knightLogic: KnightLogic

    constructor(pool: Pool, knightLogic: KnightLogic) {
        this.pool = pool
        this.knightLogic = knightLogic
    }

    async create() {
        log.admin('Creating demo data...')

        let tx = new MariaTransaction(this.pool)

        let luisa = new Knight({
            name: 'Luisa',
            address: new Address('Gardenstreet', '42c', '12345', 'Gardencity', 'Gardencountry')
        })

        this.knightLogic.storeIfNotAlreadyExist(luisa, tx)
        
    }
}
