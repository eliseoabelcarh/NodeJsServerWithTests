//const { crearEstudiantesDao } = require('../../../src/estudiantes/dao/EstudiantesDaoFactory.js')
//const { crearEstudiantesApi } = require('../../../src/estudiantes/aplicacion/EstudiantesApi.js')



const assert = require('assert')
const { createServer } = require('../../../src/compartido/servidor/Server.js')
const { crearClienteRest } = require('../../cliente/ClienteRest.js')

const { crearDao } = require('../../../src/factories/daoFactoryMaster.js')
const { crearApi } = require('../../../src/factories/apiFactoryMaster.js')

const estuValido = {
    nombre: 'mariano',
    apellido: 'aquino',
    edad: 34,
    dni: '123'
}

const estuValido2 = {
    nombre: 'juana',
    apellido: 'perez',
    edad: 36,
    dni: '456'
}

describe('servidor', () => {
    describe('si la base de datos anda bien', () => {

        let dao
        let server
        let cliente
        let aplicacion

        before(async () => {


            dao = await crearDao('pacientes')//

            aplicacion = await crearApi('pacientes', dao)

            server = await createServer({ aplicacion })
            cliente = crearClienteRest(server.port, 'pacientes')
        })

        afterEach(async () => {
            await dao.deleteAll()
        })

        after(async () => {

            server.close()
            await dao.close()
        })

        describe('si el puerto esta ocupado', () => {
            it('lanza un error', async () => {
                await assert.rejects(async () => {
                    const server2 = await createServer({ port: server.port, aplicacion: aplicacion })
                    server2.close()
                })
            })
        })


        describe('getAll', () => {
            it('devuelve una coleccion con esos estudiantes', async () => {
                const res1 = await cliente.post(estuValido)
                const res2 = await cliente.post(estuValido2)
                const { data } = await cliente.getAll()
                const esperado = [res1.data, res2.data]
                assert.deepStrictEqual(data, esperado)
            })
        })

        describe('getByDni', () => {
            describe('si hay estudiantes pero ninguno con ese dni', () => {
                it('devuelve una coleccion vacia', async () => {
                    await cliente.post(estuValido2)
                    const { data } = await cliente.getByDni('123')
                    const esperado = []
                    assert.deepStrictEqual(data, esperado)
                })
            })

            describe('si hay estudiantes y alguno con ese dni', () => {
                it('devuelve una coleccion con ese estudiante', async () => {
                    const res1 = await cliente.post(estuValido)
                    await cliente.post(estuValido2)
                    const { data } = await cliente.getByDni('123')
                    const esperado = [res1.data]
                    assert.deepStrictEqual(data, esperado)
                })
            })
        })

        describe('getByAge', () => {
            it('devuelve una coleccion con lxs estudiantes buscados', async () => {
                const res1 = await cliente.post(estuValido)
                const res2 = await cliente.post(estuValido2)
                const { data } = await cliente.getByAge({
                    desde: 20,
                    hasta: 35
                })
                const esperado = [res1.data]
                assert.deepStrictEqual(data, esperado)
            })
        })

        describe('post', () => {
            describe('si hay estudiantes con el mismo dni', () => {
                it('devuelve un codigo 400 y no lo agrega a la coleccion', async () => {
                    await cliente.post(estuValido)
                    await assert.rejects(async () => {
                        await cliente.post(estuValido)
                    },
                        (err) => {
                            assert.strictEqual(err.status, 400)
                            return true
                        })
                })
            })

            describe('si no hay estudiantes con el nuevo dni', () => {
                it('asigna un id al estudiante y lo agrega a la coleccion', async () => {
                    const { data, status } = await cliente.post(estuValido)
                    assert.strictEqual(status, 201)
                    assert(!!data.id)
                    delete data.id
                    assert.deepStrictEqual(data, estuValido)
                })
            })

            describe('al agregar nuevxs estudiantes', () => {
                it('asigna nuevos ids para cada unx', async () => {
                    const response1 = await cliente.post(estuValido)
                    const response2 = await cliente.post(estuValido2)
                    assert(!!response1.data.id)
                    assert(!!response2.data.id)
                    assert(response1.data.id !== response2.data.id)
                })
            })
        })

        describe('deleteById', () => {
            describe('si no hay un estudiantes con ese id', () => {
                it('lanza un error', async () => {
                    await assert.rejects(async () => {
                        await cliente.deleteById(1)
                    }, (response) => {
                        assert.strictEqual(response.status, 404)
                        return true
                    })
                })
            })

            describe('si hay estudiantes y alguno con ese id', () => {
                it('lo borra del sistema', async () => {
                    const res1 = await cliente.post(estuValido)
                    const res2 = await cliente.post(estuValido2)
                    await cliente.deleteById(res1.data.id)
                    const { data } = await cliente.getAll()
                    assert.deepStrictEqual(data, [res2.data])
                })
            })
        })

        describe('put', () => {
            describe('si no hay un estudiantes con ese id', () => {
                it('lanza un error con codigo 404', async () => {
                    const res1 = await cliente.post(estuValido)
                    const estu = { ...res1.data }
                    estu.id = -1
                    await assert.rejects(async () => {
                        await cliente.put(estu)
                    }, (error) => {
                        assert.strictEqual(error.status, 404)
                        return true
                    })
                })
            })

            describe('si hay estudiantes y alguno con ese id', () => {
                it('lo reemplaza', async () => {
                    const res1 = await cliente.post(estuValido)
                    const estuModificado = { ...res1.data }

                    estuModificado.nombre = 'nuevo nombre'
                    estuModificado.apellido = 'nuevo apellido'

                    const res2 = await cliente.put(estuModificado)

                    assert.deepStrictEqual(estuModificado, res2.data)
                    const { data } = await cliente.getAll()
                    assert.deepStrictEqual(data, [estuModificado])
                })
            })
        })
    })

    async function assertItThrows500(block) {
        await assert.rejects(async () => {
            await block()
        }, error => {
            assert.strictEqual(error.status, 500)
            return true
        })
    }

    describe('si la base de datos esta caida', () => {

        let db
        let server
        let cliente
        let aplicacion

        before(async () => {

            dao = await crearDao('que_falla')//
            aplicacion = await crearApi('pacientes', dao)
            server = await createServer({ aplicacion })
            cliente = crearClienteRest(server.port, 'pacientes')


        })

        after(async () => {
            server.close()
            await dao.close()
        })

        describe('getAll', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    await cliente.getAll()
                })
            })
        })

        describe('getByDni', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    await cliente.getByDni('123')
                })
            })
        })

        describe('getByAge', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    await cliente.getByAge({
                        desde: 90,
                        hasta: 100
                    })
                })
            })
        })

        describe('post', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    await cliente.post(estuValido)
                })
            })
        })

        describe('deleteById', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    await cliente.deleteById(1)
                })
            })
        })

        describe('put', () => {
            it('lanza un error con codigo de error 500', async () => {
                await assertItThrows500(async () => {
                    const estuCreado = { ...estuValido, id: -1 }
                    await cliente.put(estuCreado)
                })
            })
        })
    })
})