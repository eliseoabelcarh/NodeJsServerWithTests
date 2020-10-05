
const express = require('express')
const { crearPacientesRouter } = require('../../pacientes/routers/pacientesRouterExpress.js')


function createServer({ port = 0, aplicacion }) {

    const app = express()

    app.use(express.json())

    //esto aplica la ruta ==> /api/pacientes  =>> y crea el router según el tipo
    app.use('/api/' + aplicacion.type, crearRouterFactory(aplicacion))

    app.use(manejadorDeErrores)

    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .once('error', () => {
                reject(new Error('error al conectarse al servidor'))
            })
            .once('listening', () => {
                server.port = server.address().port
                console.log('servidor listo y escuchando.....')
                resolve(server)
            })
    })
}



function crearRouterFactory(aplicacion) {

    const routersFactory = {
        'pacientes': crearPacientesRouter({ aplicacion })
    }

    const type = aplicacion.type

    if (type) {
        return routersFactory[type]
    } else {
        console.log('no existe router para esa aplicación')
    }

}



function manejadorDeErrores(error, req, res, next) {
    if (error.type === 'INVALID_ARGS') {
        res.status(400)
    } else if (error.type === 'NOT_FOUND') {
        res.status(404)
    } else if (error.type === 'INTERNAL_ERROR') {
        res.status(500)
    } else {
        res.status(520)
    }
    res.json({ message: error.message })
}

module.exports = { createServer }