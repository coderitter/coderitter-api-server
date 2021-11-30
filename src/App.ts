import Services from './Services'

/**
 * This is the main entry point of the application. It starts all the services and migrates
 * the database to the newest version.
 */
class App {
    async start() {
        await Services.get().start()
        await Services.get().dbMigration.migrate()

        //await Services.get().demoData.create()
    }
}

let app = new App()
app.start()