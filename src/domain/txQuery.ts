import { MariaTransaction } from 'knight-maria-transaction'

export function txQuery(
    tx: MariaTransaction
): (sqlString: string, values?: any[]) => Promise<any[]> {
    return async (sqlString: string, values?: any[]) => {
        let result = await tx.query(sqlString, values)
        return result.rows
    }
}
