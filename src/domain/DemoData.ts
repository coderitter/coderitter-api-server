import { PgTransaction } from 'knight-pg-transaction'
import { Pool } from 'pg'
import { Log } from 'knight-log'
import KnightLogic from '../domain/knight/KnightLogic'
import Knight, { Address } from '../domain/knight/Knight'

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

        let lAddress = new Address('Gardenstreet', '42c', '12345', 'Gardencity', 'Gardencountry')

        let luisa = new Knight({
            name: 'Luisa',
            address: lAddress
        })

        //await this.knightLogic.store(luisa, tx)

        let alreadyExist = await this.knightLogic.read({name: 'Luisa'}, tx)
        if(alreadyExist.entities.length === 0){
            let result = await this.knightLogic.store(luisa, tx)
            log.admin('created knight', result)
        }
        else{
            log.admin('demo data already exists.. skipping..')
        }
    }
}