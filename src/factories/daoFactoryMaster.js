


const { crearDaoConFallas } = require('../../test/doubles/DaoConFallas.js')
const { crearPacientesDao } = require('../pacientes/dao/pacientesDaoFactory.js')

async function crearDao(entidad) {

    if (entidad === 'pacientes')
        return await crearPacientesDao()
    else if (entidad === 'que_falla') {
        return await crearDaoConFallas()
    }
    else
        throw new Error('invalid type of entity')

}

module.exports = { crearDao }