

const assert = require('assert')
const should = require('should');

const { createServer } = require('../../../src/compartido/servidor/Server.js')
const { crearClienteRest } = require('../../cliente/ClienteRest.js')

const { crearDao } = require('../../../src/factories/daoFactoryMaster.js')
const { crearApi } = require('../../../src/factories/apiFactoryMaster.js')

const modeloPaciente = require('../../../src/pacientes/modelo/models.js')


describe('servidor', () => {
    describe('si la base de datos anda bien', () => {

        let dao
        let server
        let cliente
        let aplicacion

        before(async () => {

            dao = await crearDao('pacientes')//
            aplicacion = await crearApi('pacientes', dao)
            server = await createServer({ aplicacion: aplicacion })
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
            it('devuelve una coleccion con esos pacientes', async () => {
                const res1 = await cliente.post(modeloPaciente.valido)
                const res2 = await cliente.post(modeloPaciente.valido2)
                const { data } = await cliente.getAll()
                const esperado = [res1.data, res2.data]
                assert.deepStrictEqual(data, esperado)
            })
        })

        describe('getByDni', () => {
            describe('si hay pacientes pero ninguno con ese dni', () => {
                it('devuelve una coleccion vacia', async () => {
                    await cliente.post(modeloPaciente.valido2)
                    const { data } = await cliente.getByDni('123')
                    const esperado = []
                    assert.deepStrictEqual(data, esperado)
                })
            })

            describe('si hay pacientes y alguno con ese dni', () => {
                it('devuelve una coleccion con ese paciente', async () => {
                    const res1 = await cliente.post(modeloPaciente.valido)
                    await cliente.post(modeloPaciente.valido2)
                    const { data } = await cliente.getByDni('123')
                    const esperado = [res1.data]
                    assert.deepStrictEqual(data, esperado)
                })
            })
        })

        describe('getByAge', () => {
            it('devuelve una coleccion con lxs pacientes buscados', async () => {
                const res1 = await cliente.post(modeloPaciente.valido)
                const res2 = await cliente.post(modeloPaciente.valido2)
                const { data } = await cliente.getByAge({
                    desde: 20,
                    hasta: 35
                })
                const esperado = [res1.data]
                assert.deepStrictEqual(data, esperado)
            })
        })

        describe('post', () => {
            describe('si hay pacientes con el mismo dni', () => {
                it('devuelve un codigo 400 y no lo agrega a la coleccion', async () => {
                    await cliente.post(modeloPaciente.valido)
                    await assert.rejects(async () => {
                        await cliente.post(modeloPaciente.valido)
                    },
                        (err) => {
                            assert.strictEqual(err.status, 400)
                            return true
                        })
                })
            })

            describe('si no hay pacientes con el nuevo dni', () => {
                it('asigna un id al paciente y lo agrega a la coleccion', async () => {
                    const { data, status } = await cliente.post(modeloPaciente.valido)
                    assert.strictEqual(status, 201)
                    assert(!!data.id)
                    delete data.id
                    assert.deepStrictEqual(data, modeloPaciente.valido)
                })
            })

            describe('al agregar nuevxs pacientes', () => {
                it('asigna nuevos ids para cada unx', async () => {
                    const response1 = await cliente.post(modeloPaciente.valido)
                    const response2 = await cliente.post(modeloPaciente.valido2)
                    assert(!!response1.data.id)
                    assert(!!response2.data.id)
                    assert(response1.data.id !== response2.data.id)
                })
            })
        })

        describe('deleteById', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error', async () => {
                    await assert.rejects(async () => {
                        await cliente.deleteById(1)
                    }, (response) => {
                        assert.strictEqual(response.status, 404)
                        return true
                    })
                })
            })

            describe('si hay pacientes y alguno con ese id', () => {
                it('lo borra del sistema', async () => {
                    const res1 = await cliente.post(modeloPaciente.valido)
                    const res2 = await cliente.post(modeloPaciente.valido2)
                    await cliente.deleteById(res1.data.id)
                    const { data } = await cliente.getAll()
                    assert.deepStrictEqual(data, [res2.data])
                })
            })
        })

        describe('put', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error con codigo 404', async () => {
                    const res1 = await cliente.post(modeloPaciente.valido)
                    const paciente = { ...res1.data }
                    paciente.id = -1
                    await assert.rejects(async () => {
                        await cliente.put(paciente, paciente.id)
                    }, (error) => {
                        assert.strictEqual(error.status, 404)
                        return true
                    })
                })
            })

            describe('si hay pacientes y alguno con ese id', () => {
                it('lo reemplaza', async () => {
                    const res1 = await cliente.post(modeloPaciente.valido)
                    const pacienteModificado = { ...res1.data }

                    pacienteModificado.nombre = 'nuevo nombre'
                    pacienteModificado.apellido = 'nuevo apellido'

                    const res2 = await cliente.put(pacienteModificado, pacienteModificado.id)

                    assert.deepStrictEqual(pacienteModificado, res2.data)
                    const { data } = await cliente.getAll()
                    assert.deepStrictEqual(data, [pacienteModificado])
                })
            })

            describe('se quiere modificar paciente y id en url no corresponde a paciente', () => {
                it('no lo reemplaza y se recibe error', async () => {
                    const res1 = await cliente.post(modeloPaciente.valido)
                    const pacienteModificado = { ...res1.data }
                    pacienteModificado.nombre = 'nuevo nombre'
                    pacienteModificado.apellido = 'nuevo apellido'
                    const idQueNoCorrespondeAPaciente = pacienteModificado.id + '5'

                    await assert.rejects(async () => {
                        await cliente.put(pacienteModificado, idQueNoCorrespondeAPaciente)
                    }, (error) => {
                        assert.strictEqual(error.status, 400)
                        const esperado = 'Id: no coinciden los ids'
                        assert.strictEqual(esperado, error.message)
                        return true
                    })

                })
            })


            describe('PRUEBA MÚLTIPLE: se envía paciente sin algún campo requerido', () => {
                it('no lo agrega y se recibe error de acuerdo al campo faltante', async () => {
                    const erroresARecibir = [
                        'nombre: campo requerido',
                        'apellido: campo requerido',
                        'edad: campo requerido',
                        'dni: campo requerido',
                        'dni: debe contener unicamente caracteres numericos',
                        'edad: debe ser un entero'
                    ]
                    const camposInvalidos = [
                        modeloPaciente.sinCampoNombre,
                        modeloPaciente.sinCampoEdad,
                        modeloPaciente.sinCampoDni,
                        modeloPaciente.conDniNoNumerico,
                        modeloPaciente.conEdadNoNumerico
                    ]

                    async function test(pacienteSinCampoX) {
                        await assert.rejects(async () => {
                            await cliente.post(pacienteSinCampoX)
                        }, (error) => {
                            assert.strictEqual(error.status, 400)
                            erroresARecibir.should.matchAny(error.message)
                            return true
                        })
                    }

                    for (let i = 0; i < camposInvalidos.length; i++) {
                        const element = camposInvalidos[i];
                        await test(element)
                    }


                })
            })


            describe('some', () => {
                it('some', async () => {

                    const erroresARecibir = [
                        'dni: el dni del paciente debe ser numerico',
                        'getByAge: el rango de edades debe ser numerico',
                        'el id del paciente debe ser numerico: undefined'
                    ]
                    //métodos y campos erronesos deben coincidir en index
                    const metodos = [
                        'getByDni',
                        'getByAge',
                        'deleteById'
                    ]
                    const camposErroneos = [
                        modeloPaciente.conDniNoNumerico,
                        { desde: 'noEsNro', hasta: 35 }
                    ]

                    async function test(metodo, campoErroneo) {
                        await assert.rejects(async () => {
                            await cliente[metodo](campoErroneo)
                        }, (error) => {
                            assert.strictEqual(error.status, 400)
                            erroresARecibir.should.matchAny(error.message)
                            console.log(error.message)
                            return true
                        })
                    }


                    for (let i = 0; i < metodos.length; i++) {
                        const metodo = metodos[i];
                        const campoErroneo = camposErroneos[i]
                        await test(metodo, campoErroneo)
                    }





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

        let dao
        let server
        let cliente
        let aplicacion

        before(async () => {

            dao = await crearDao('que_falla')//
            aplicacion = await crearApi('pacientes', dao)
            server = await createServer({ aplicacion: aplicacion })
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
                    await cliente.post(modeloPaciente.valido)
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
                    const pacienteCreado = { ...modeloPaciente.valido, id: -1 }
                    await cliente.put(pacienteCreado, pacienteCreado.id)
                })
            })
        })
    })
})