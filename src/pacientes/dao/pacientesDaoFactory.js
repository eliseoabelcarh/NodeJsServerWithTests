//const { crearEstudiantesDaoDb } = require('./EstudiantesDaoDb.js')
//const { crearEstudiantesDaoMemoria } = require('./EstudiantesDaoMemory.js')



//const config = require('../../config/config.js')

const { crearPacientesDaoMemoria } = require('./pacientesDaoMemoria.js')



async function crearPacientesDao() {

    const tipoPersistencia = 'memoria'//CAMBIAR LUEGO en config.getTipoPers()



    if (tipoPersistencia === 'memoria')
        return await crearPacientesDaoMemoria()
    /*     else if (tipoPersistencia === 'db')
            return await crearPacientesDaoDb(config.getCnxObj()) */
    else
        throw new Error('invalid type of DAO')
}

module.exports = { crearPacientesDao }