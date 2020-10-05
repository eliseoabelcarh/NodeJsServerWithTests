

const { crearPacientesApi } = require('../pacientes/aplicacion/pacientesApi.js')

async function crearApi(entidad, dao) {

    if (entidad === 'pacientes') {
        const api = await crearPacientesApi(dao)
        return api
    }
    throw new Error('invalid type of entity')

}

module.exports = { crearApi }