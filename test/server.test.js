const assert = require('assert')

const { getDao } = require('../src/dao/daoFactory.js')
const { crearServidor } = require('../src/server.js')
const { crearClienteRest } = require('../src/ClienteRest.js')






describe('PARA LA RUTA ENSAYOS CLINICOS', () => {

    describe('PARA UNA BASE DE DATOS QUE FUNCIONA', () => {

        let dao
        let cliente
        let server

        before(async () => {
            dao = getDao('memoria')
            await dao.connect()
        })

        after(async () => {
            await dao.close()
        })

        beforeEach(async () => {

            let urlServidor = 'http://localhost'
            let rutaApi = '/api/ensayosClinicos'

            server = await crearServidor({ dao: dao })
            cliente = crearClienteRest(urlServidor, server.port, rutaApi)
        })

        afterEach(async () => {
            server.close()
            await dao.deleteAll()
        })



        describe('si el puerto esta ocupado', () => {
            it('no se conecta y lanza un error', async () => {
                await assert.rejects(async () => {
                    await crearServidor({ puerto: server.port, dao })
                }, (error) => {
                    assert.strictEqual(error.message, 'address in use')
                    return true
                })
            })
        })




        describe('para cliente.getAll', () => {



            describe('si no hay ensayos clínicos', () => {
                it('devuelve una coleccion vacia', async () => {
                    const ensayosClinicos = await cliente.getAll()
                    const esperado = []
                    assert.deepStrictEqual(ensayosClinicos, esperado)
                })
            })



        })



    })
})