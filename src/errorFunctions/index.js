function crearErrorDeUsuario(msg) {
    const errObj = new Error(msg)
    errObj.type = 'USER_ERROR'
    return errObj
}

function crearErrorDelServidor(msg) {
    const errObj = new Error(msg)
    errObj.type = 'SERVER_ERROR'
    return errObj
}

function simplificarError(error) {
    const newError = new Error(error.response.data.message)
    newError.status = error.response.status
    return newError
}

module.exports = { crearErrorDeUsuario, crearErrorDelServidor, simplificarError }