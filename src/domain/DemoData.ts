import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import { Log } from 'knight-log'
import KnightLogic from '../domain/knight/KnightLogic'
import Knight, { Adress } from '../domain/knight/Knight'

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

        let tx = new PgTransaction(this.pool)

        let lAdress = new Adress('Gardenstreet', '42c', '12345', 'Gardencity', 'Gardencountry')

        let luisa = new Knight({
            name: 'Luisa',
            adress: lAdress
        })

        log.admin('luisa', luisa)
        let result = await this.knightLogic.create(luisa, tx)
        log.admin('created knight', result)

    }
}