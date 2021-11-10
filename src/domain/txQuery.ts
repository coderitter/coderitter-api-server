import { PgTransaction } from 'knight-pg-transaction'

export function txQuery(tx: PgTransaction): (sqlString: string, values?: any[]) => Promise<any[]> {
    return async (sqlString: string, values?: any[]) => {
        let result = await tx.query(sqlString, values)
        return result.rows
    }
}
