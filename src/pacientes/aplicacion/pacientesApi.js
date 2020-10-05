const { crearErrorArgumentosInvalidos } = require('../../compartido/errores/ApiError.js')
const { crearPaciente } = require('../modelo/Paciente.js')

async function crearPacientesApi(pacientesDao) {
    return {

        type: 'pacientes',

        getByDni: async (dato) => {
            const dniValido = crearDniValido(dato)
            const pacientes = await pacientesDao.getByDni(dniValido)
            return pacientes
        },

        getAll: async () => {
            pacientes = await pacientesDao.getAll()
            return pacientes
        },

        getByAge: async (datos) => {
            const rango = crearRangoValido(datos)
            pacientes = await pacientesDao.getByAge(rango)
            return pacientes
        },
        create: async (datos) => {
            const paciente = crearPaciente(datos)
            await pacientesDao.addUnique(paciente, 'dni')
            return paciente
        },
        deleteById: async (dato) => {
            const idNumerico = crearIdValido(dato)
            await pacientesDao.deleteById(idNumerico)
        },
        replaceById: async (datos, unId) => {
            if (!datos.id || !unId || datos.id != unId) {
                throw crearErrorArgumentosInvalidos('no coinciden los ids')
            }
            const paciente = crearPaciente(datos)
            await pacientesDao.updateById(paciente)
            return paciente
        }
    }
}

function crearDniValido(dato) {
    if (isNaN(dato)) {
        throw crearErrorArgumentosInvalidos('el dni del paciente debe ser numerico')
    }
    return dato
}

function crearRangoValido(obj) {
    const rango = {
        desde: parseInt(obj.desde),
        hasta: parseInt(obj.hasta)
    }

    if (isNaN(rango.desde) || isNaN(rango.hasta)) {
        throw crearErrorArgumentosInvalidos('el rango de edades debe ser numerico')
    }

    return rango
}

function crearIdValido(dato) {
    const idNumerico = parseInt(dato)
    if (isNaN(idNumerico)) {
        throw crearErrorArgumentosInvalidos('el id del paciente debe ser numerico')
    }
    return idNumerico
}

module.exports = { crearPacientesApi }