const { crearErrorArgumentosInvalidos } = require('../../compartido/errores/ApiError.js')

let nextId = 1

function crearPaciente(objeto) {

    const paciente = {}

    if (!objeto.nombre) {
        throw crearErrorArgumentosInvalidos('nombre', 'campo requerido')
    } else {
        paciente.nombre = objeto.nombre
    }

    if (!objeto.apellido) {
        throw crearErrorArgumentosInvalidos('apellido', 'campo requerido')
    } else {
        paciente.apellido = objeto.apellido
    }

    if (!objeto.edad) {
        throw crearErrorArgumentosInvalidos('edad', 'campo requerido')
    }

    if (isNaN(parseInt(objeto.edad))) {
        throw crearErrorArgumentosInvalidos('edad', 'debe ser un entero')
    } else {
        paciente.edad = objeto.edad
    }

    if (!objeto.dni) {
        throw crearErrorArgumentosInvalidos('dni', 'campo requerido')
    }

    if (isNaN(parseInt(objeto.dni))) {
        throw crearErrorArgumentosInvalidos('dni', 'debe contener unicamente caracteres numericos')
    } else {
        paciente.dni = objeto.dni
    }

    if (!objeto.id) {
        paciente.id = nextId++
    } else {
        paciente.id = objeto.id
    }

    return paciente
}

module.exports = { crearPaciente }