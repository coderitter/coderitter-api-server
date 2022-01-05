import { Log } from 'knight-log'
import 'mocha'
import Services from '../src/Services'

Log.globalLevel = 'silent'

before(async function () {
    this.timeout(20000)
    Services.get().useTestConfig()
    await Services.get().start()
})

after(async function () {
    await Services.get().stop()
})
