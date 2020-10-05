const {
    crearErrorDeBaseDeDatos,
} = require('../../src/compartido/errores/ApiError.js')

async function crearDaoConFallas() {
    return {
        // add: async () => { throw crearErrorDeBaseDeDatos('add') },
        addUnique: async () => { throw crearErrorDeBaseDeDatos('addUnique') },
        // addAll: async () => { throw crearErrorDeBaseDeDatos('addAll') },
        getAll: async () => { throw crearErrorDeBaseDeDatos('getAll') },
        getByDni: async () => { throw crearErrorDeBaseDeDatos('getByDni') },
        getByAge: async () => { throw crearErrorDeBaseDeDatos('getByAge') },
        deleteById: async () => { throw crearErrorDeBaseDeDatos('deleteById') },
        updateById: async () => { throw crearErrorDeBaseDeDatos('updateById') },
        deleteAll: async () => { },
        close: async () => { }
    }
}

module.exports = { crearDaoConFallas }