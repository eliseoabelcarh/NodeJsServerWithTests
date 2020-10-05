const { createServer } = require('./compartido/servidor/Server.js')
const { crearEstudiantesDao } = require('./estudiantes/dao/EstudiantesDaoFactory')
const { crearEstudiantesApi } = require('./estudiantes/aplicacion/EstudiantesApi.js')
const config = require('../src/config/config.js')

let daoEstudiantes
let server

async function main() {
    try {
        daoEstudiantes = await crearEstudiantesDao()
        console.log(`base de datos conectada`)

        aplicacion = crearEstudiantesApi(daoEstudiantes)

        server = await createServer({ aplicacion, port: config.getServerPort() })
        console.log(`servidor conectado en puerto: ${server.port}`)
    } catch (e) {
        console.log(e.message)
    }
}

process.on('SIGINT', async () => {
    try {
        if (server) {
            server.close()
            console.log('servidor cerrado con exito')
        }
        if (daoEstudiantes) {
            await daoEstudiantes.close()
            console.log('base de datos desconectada con exito')
        }
    } catch (error) {
        console.err(error)
    } finally {
        process.exit(0)
    }
})

main()