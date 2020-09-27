const express = require('express')


function crearServidor({ puerto = 0, dao }) {
    return new Promise((resolve, reject) => {

        const app = express()

        app.use(express.json())



        app.get('/api/ensayosClinicos', async (request, response) => {
            const ensayosClinicos = await dao.getAll()
            response.json(ensayosClinicos)
        })





        const server = app.listen(puerto)
            .on('listening', () => {
                server.port = server.address().port
                resolve(server)
            })
            .on('error', () => reject(new Error('address in use')))
    })
}


function manejarError(error, response) {
    if (error.type === 'USER_ERROR') {
        response.status(400)
    } else {
        response.status(500)
    }
    response.json({ message: error.message })
}


module.exports = { crearServidor }