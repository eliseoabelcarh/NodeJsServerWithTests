require('dotenv').config()

let tipoPersistencia
let logEnabled
const serverPort = process.env.SERVER_PORT

const cnxObj = {
    dbName: 'ort_tp2',
    collectionName: 'estudiantes',
}

if (process.env.MODE === 'PROD') {
    cnxObj.cnxStr = process.env.CNX_STR_PROD
    tipoPersistencia = process.env.TIPO_PERSISTENCIA_PROD
    logEnabled = false
} else if (process.env.MODE === 'LOCAL') {
    cnxObj.cnxStr = process.env.CNX_STR_LOCAL
    tipoPersistencia = process.env.TIPO_PERSISTENCIA_LOCAL
    logEnabled = false
} else {
    tipoPersistencia = process.env.TIPO_PERSISTENCIA_DEV
    logEnabled = true
}

const config = {
    getCnxObj: () => Object.freeze(cnxObj),
    getTipoPers: () => tipoPersistencia,
    isLogEnabled: () => logEnabled,
    getServerPort: () => serverPort
}

module.exports = Object.freeze(config)
