const { crearDaoMemoria } = require("./daoMemoria")
const { crearDaoQueFalla } = require("./daoQueFalla")
const { crearDaoDatabase } = require("./daoDatabase")


function getDao(tipo) {
    if (tipo === 'memoria') return crearDaoMemoria()
    if (tipo === 'que_falla') return crearDaoQueFalla()
    if (tipo === 'database') return crearDaoDatabase()
    throw new Error('opcion de persistencia inválida')
}

module.exports = { getDao }