import { Log } from 'knight-log'
import { PoolConfig } from 'mariadb'
import { HttpApiConfig } from './api/HttpApi'

let log = new Log('config.ts')

const databaseName = 'coderitter'

/**
 * Development config
 */
export const dev = {
    db: <PoolConfig>{
        host: 'db',
        user: databaseName,
        password: '1234',
        database: databaseName
    },

    httpApi: <HttpApiConfig>{
        port: 3000
    }
}

/**
 * Test config
 */
export const test = merge(dev, {
    db: <PoolConfig>{
        host: 'dbtest',
        user: databaseName + '_test',
        database: databaseName + '_test'
    }
})

/**
 * Production config
 */
export const prod = merge(dev, {
    db: <PoolConfig>{
        host: 'db',
        user: databaseName + '_prod',
        database: databaseName + '_prod'
    }
})

/**
 * This function selects a config according to a command line parameter which might be
 * 'prod' or 'test'.
 *
 * @returns A config
 */
export function getConfigByArgv() {
    const args = process.argv.slice(2)

    if (args.length > 0) {
        const mode = args[0]

        if (mode == 'test') {
            log.admin(
                "Found mode command line parameter. Returning config 'test'"
            )
            return test
        }

        if (mode == 'prod') {
            log.admin(
                "Found mode command line parameter. Returning config 'prod'"
            )
            return prod
        }
    }

    return dev
}

/**
 * Determines a config according to a the value of the environment variable 'MODE'. The value can be either
 * 'test' or 'prod'.
 *
 * @returns A config
 */
export function getConfigByEnv() {
    for (let prop in process.env) {
        if (prop.toLowerCase() == 'mode') {
            if (process.env[prop] == 'test') {
                log.admin(
                    "Found mode environment parameter. Returning config 'test'"
                )
                return test
            }

            if (process.env[prop] == 'prod') {
                log.admin(
                    "Found mode environment parameter. Returning config 'test'"
                )
                return prod
            }
        }
    }

    return dev
}

/**
 * Return a config either according to a command line parameter or to a set 'MODE' environment variable,
 * in this order.
 *
 * @returns A config
 */
export function getConfigByArgvOrEnvOrDefault() {
    const args = process.argv.slice(2)

    if (args.length > 0) {
        return getConfigByArgv()
    }

    return getConfigByEnv()
}

/**
 * This function merges arbitrary many objects into one. You can use it to merge two configuration objects.
 *
 * @param objects Arbitrary many JavaScript objects. The latter object overwrite the former one.
 * @returns A merged object
 */
export function merge(...objects: any[]) {
    const isObject = (obj: any) => obj && typeof obj === 'object'

    return objects.reduce((previous, current) => {
        Object.keys(current).forEach((key) => {
            const previousValue = previous[key]
            const currentValue = current[key]

            if (Array.isArray(previousValue) && Array.isArray(currentValue)) {
                previous[key] = previousValue.concat(...currentValue)
            }
            else if (isObject(previousValue) && isObject(currentValue)) {
                previous[key] = merge(previousValue, currentValue)
            }
            else {
                previous[key] = currentValue
            }
        })

        return previous
    }, {})
}
