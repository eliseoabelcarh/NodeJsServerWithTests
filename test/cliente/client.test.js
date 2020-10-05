const assert = require('assert')
const { crearClienteRest } = require('./ClienteRest.js')

describe('client', () => {
    describe('si no se encuentra al servidor', () => {
        it('lanza un error', async () => {
            const cliente = crearClienteRest(0)
            await assert.rejects(async () => {
                await cliente.getAll()
            }, error => {
                assert.strictEqual(error.message, 'error al enviar la peticion')
                return true
            })
        })
    })
})