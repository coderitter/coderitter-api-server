import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { RemoteMethodCall, Result } from 'coderitter-api-remote-method-call'
import http from 'http'
import { fromJsonObj, toJsonObj } from 'knight-json'
import { Log } from 'knight-log'

let log = new Log('HttpApi.ts')


interface StartNodeError extends Error{
    code: string
}
/**
 * It receives the data directly from the HTTP server and
 * uses the Api object to execute the remote method call.
 *
 * Also it converts the incoming JSON with the help of knight-json
 * to instances of the original classes.
 *
 * And it converts the outgoing object with the help of knight-json
 * to a JSON string which contains the class information.
 */
export default class HttpApi {

    server!: http.Server
    api: RemoteMethodApi
    instantiator: { [className: string]: () => any }
    config: HttpApiConfig = {}

    constructor(api: RemoteMethodApi, instantiator: { [className: string]: () => any }, config?: HttpApiConfig) {
        this.api = api
        this.instantiator = instantiator
        this.config = config || this.config
    }

    /**
   * Adds a listener to the native Node HTTP server which accepts remote method calls.
   */
    async start(): Promise<void> {
        this.server.addListener('request', (request, response) => {
            if (request.url == '/api_v1') {
                let data = ''

                request.on('data', (chunk: any) => {
                    data += chunk
                })

                request.on('end', () => {
                    this.handlePostOnlyRequest(data, request, response)
                })
            }
            else {
                response.end()
            }
        })

        return new Promise<void>((resolve) => {
            this.server?.listen(this.config.port, () => {
                log.admin('HTTP API started at ' + this.config.port)
                resolve()
            })
        })
    }

    /**
   * Handles a POSTonly HTTP style request. It tries to parse the received data as a JSON string, calls
   * the remote method and sends back the result to the client.
   *
   * @param data The received data.
   * @param request
   * @param response
   */
    async handlePostOnlyRequest(data: any, request: http.IncomingMessage, response: http.ServerResponse) {
        let l = log.fn('handlePostOnlyRequest')
        l.param('request.url', request.url)
        l.param('data', data)

        let result: Result | undefined = undefined

        let remoteMethodCall: RemoteMethodCall | undefined = undefined
        try {
            remoteMethodCall = <RemoteMethodCall>fromJsonObj(data, { instantiator: this.instantiator })
        }
        catch (e) {
            l.error('Could not parse the JSON containing the RemoteMethodCall')
            result = Result.remoteError('Could not parse the JSON containing the RemoteMethodCall')
        }

        l.dev('remoteMethodCall', remoteMethodCall)

        // if the result is not already erroneous
        if ((!result || result && !result.isRemoteError()) && remoteMethodCall) {
            l.admin('Calling method...')
            result = await this.api.callMethod(remoteMethodCall)
        }

        l.dev('result', result)

        let resultObj = toJsonObj(result)
        l.dev('resultObj', resultObj)

        let resultJson
        try {
            resultJson = JSON.stringify(resultObj)
            l.dev('resultJson', resultJson)
        }
        catch (e) {
            l.error('Could not stringify result to JSON.', e)
            let errorResult = Result.remoteError('Could not stringify result to JSON')
            let errorResultObj = toJsonObj(errorResult)
            resultJson = JSON.stringify(errorResultObj)
        }

        response.setHeader('Access-Control-Allow-Origin', '*')
        response.end(resultJson, 'utf-8')
        l.admin('Response was send')
    }
}

export interface HttpApiConfig {
    port?: number
}