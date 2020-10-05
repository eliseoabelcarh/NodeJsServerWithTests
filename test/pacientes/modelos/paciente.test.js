

const assert = require('assert')
const should = require('should');
const { crearPaciente } = require('../../../src/pacientes/modelo/Paciente.js')
const modeloPaciente = require('../../../src/pacientes/modelo/models.js')
const { crearApi } = require('../../../src/factories/apiFactoryMaster.js')
const { crearDao } = require('../../../src/factories/daoFactoryMaster.js')

describe('TESTSs para crearPaciente y PacientesApi', () => {

    describe('PRUEBA MÚLTIPLE: se envía paciente sin algún campo requerido', () => {
        it('no lo agrega y se recibe error de acuerdo al campo faltante', () => {
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
                modeloPaciente.conEdadNoNumerico,
                modeloPaciente.sinCampoApellido
            ]

            async function test(pacienteSinCampoX) {
                assert.throws(() => {
                    crearPaciente(pacienteSinCampoX)
                }, (error) => {
                    //assert.strictEqual(error.status, 400)
                    erroresARecibir.should.matchAny(error.message)
                    return true
                })
            }

            for (let i = 0; i < camposInvalidos.length; i++) {
                const element = camposInvalidos[i];
                test(element)
            }


        })
    })






    describe('se envía datos con campos no validos', () => {
        it('deben devolver los errores esperados', async () => {

            let dao = await crearDao('pacientes')
            let aplicacion = await crearApi('pacientes', dao)

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
                    await aplicacion[metodo](campoErroneo)
                }, (error) => {
                    erroresARecibir.should.matchAny(error.message)
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
