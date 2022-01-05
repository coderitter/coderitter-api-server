import Services from './Services'

async function run() {
    await Services.get().startDb()
    Services.get().inject()
    await Services.get().stop()
}

run()