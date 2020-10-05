const { crearApi } = require("../../../src/factories/apiFactoryMaster.js")
const { crearDao } = require("../../../src/factories/daoFactoryMaster.js")
const { crearPaciente } = require("../../../src/pacientes/modelo/Paciente.js")
const assert = require('assert')

const modelo = require('../../../src/pacientes/modelo/models.js')
const { crearDaoConFallas } = require("../../doubles/DaoConFallas.js")

describe('aplicacion', () => {
    describe('si la base de datos anda bien', () => {

        let dao
        let api


        before(async () => {
            dao = await crearDao('pacientes')
        })

        beforeEach(async () => {
            api = await crearApi('pacientes', dao)
        })

        afterEach(async () => {
            await dao.deleteAll()
        })

        after(async () => {
            await dao.close()
        })

        describe('getAll', () => {
            describe('si no hay pacientes', () => {
                it('devuelve una coleccion vacia', async () => {
                    const pacientes = await api.getAll()
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes', () => {
                it('devuelve una coleccion con esos pacientes', async () => {
                    const creado1 = crearPaciente(modelo.valido)
                    const creado2 = crearPaciente(modelo.valido2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getAll()
                    const esperado = [creado1, creado2]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('getByDni', () => {
            describe('si hay pacientes pero ninguno con ese dni', () => {
                it('devuelve una coleccion vacia', async () => {
                    await dao.add(crearPaciente(modelo.valido2))
                    const pacientes = await api.getByDni('123')
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes y alguno con ese dni', () => {
                it('devuelve una coleccion con ese paciente', async () => {
                    const creado1 = crearPaciente(modelo.valido)
                    const creado2 = crearPaciente(modelo.valido2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByDni('123')
                    const esperado = [creado1]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('getByAge', () => {
            describe('si hay pacientes pero ninguno con edad en rango', () => {
                it('devuelve una coleccion vacia', async () => {
                    const creado1 = crearPaciente(modelo.valido)
                    const creado2 = crearPaciente(modelo.valido2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByAge({
                        desde: 90,
                        hasta: 100
                    })
                    const esperado = []
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })

            describe('si hay pacientes y alguno con edad en rango', () => {
                it('devuelve una coleccion con esxs pacientes', async () => {
                    const creado1 = crearPaciente(modelo.valido)
                    const creado2 = crearPaciente(modelo.valido2)
                    await dao.addAll([creado1, creado2])
                    const pacientes = await api.getByAge({
                        desde: 20,
                        hasta: 34
                    })
                    const esperado = [creado1]
                    assert.deepStrictEqual(pacientes, esperado)
                })
            })
        })

        describe('create', () => {
            describe('si hay pacientes con el mismo dni', () => {
                it('lanza un error de argumentos invalidos y no lo agrega a la coleccion', async () => {
                    await dao.add(crearPaciente(modelo.valido))
                    await assert.rejects(async () => {
                        await api.create(modelo.valido)
                    },
                        (err) => {
                            assert.strictEqual(err.type, 'INVALID_ARGS')
                            return true
                        })
                })
            })

            describe('si no hay pacientes con el nuevo dni', () => {
                it('asigna un id al paciente y lo agrega a la coleccion', async () => {
                    const paciente = await api.create(modelo.valido)
                    assert(!!paciente.id)
                    delete paciente.id
                    assert.deepStrictEqual(paciente, modelo.valido)
                })
            })

            describe('al agregar nuevxs pacientes', () => {
                it('asigna nuevos ids para cada unx', async () => {
                    const paciente1 = await api.create(modelo.valido)
                    const paciente2 = await api.create(modelo.valido2)
                    assert(!!paciente1.id)
                    assert(!!paciente2.id)
                    assert(paciente1.id !== paciente2.id)
                })
            })
        })

        describe('deleteById', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error de recurso no encontrado', async () => {
                    await assert.rejects(async () => {
                        await api.deleteById(1)
                    }, (error) => {
                        assert.strictEqual(error.type, 'NOT_FOUND')
                        return true
                    })
                })
            })

            describe('si hay pacientes y alguno con ese id', () => {
                it('lo borra del sistema', async () => {
                    const creado1 = crearPaciente(modelo.valido)
                    const creado2 = crearPaciente(modelo.valido2)
                    await dao.addAll([creado1, creado2])
                    await api.deleteById(creado1.id)
                    const pacientes = await dao.getAll()
                    assert.deepStrictEqual(pacientes, [creado2])
                })
            })
        })

        describe('replaceById', () => {
            describe('si no hay un pacientes con ese id', () => {
                it('lanza un error de recurso no encontrado', async () => {
                    const pacienteCreado = crearPaciente(modelo.valido)
                    await assert.rejects(async () => {
                        await api.replaceById(pacienteCreado, pacienteCreado.id)
                    }, (error) => {
                        assert.strictEqual(error.type, 'NOT_FOUND')
                        return true
                    })
                })
            })

            describe('si hay pacientes y alguno con ese id', () => {
                it('lo reemplaza', async () => {
                    const pacienteCreado = crearPaciente(modelo.valido)
                    await dao.add(pacienteCreado)

                    const pacienteModificado = { ...pacienteCreado }
                    pacienteModificado.nombre = 'nuevo nombre'
                    pacienteModificado.apellido = 'nuevo apellido'

                    const paciente = await api.replaceById(pacienteModificado, pacienteModificado.id)

                    assert.deepStrictEqual(pacienteModificado, paciente)
                    const pacientes = await dao.getAll()
                    assert.deepStrictEqual(pacientes, [pacienteModificado])
                })
            })
        })
    })

    async function assertItThrowsInternalError(block) {
        await assert.rejects(async () => {
            await block()
        }, error => {
            assert.strictEqual(error.type, 'INTERNAL_ERROR')
            return true
        })
    }

    describe('si la base de datos esta caida', () => {

        let dao
        let api







        before(async () => {
            dao = await crearDaoConFallas()
            api = await crearApi('pacientes', dao)
        })

        after(async () => {
            await dao.close()
        })

        describe('getAll', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    await api.getAll()
                })
            })
        })

        describe('getByDni', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    await api.getByDni('123')
                })
            })
        })

        describe('getByAge', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    await api.getByAge({
                        desde: 90,
                        hasta: 100
                    })
                })
            })
        })

        describe('post', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    await api.create(modelo.valido)
                })
            })
        })

        describe('deleteById', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    await api.deleteById(1)
                })
            })
        })

        describe('put', () => {
            it('lanza un error de tipo interno', async () => {
                await assertItThrowsInternalError(async () => {
                    const pacienteCreado = crearPaciente(modelo.valido)
                    await api.replaceById(pacienteCreado, pacienteCreado.id)
                })
            })
        })
    })
})
