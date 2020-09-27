
const axios = require('axios')
const { simplificarError } = require('../src/errorFunctions')


function crearClienteRest(urlServidor, puerto, rutaApi) {
    return {
        getAll: async () => {
            try {
                const respuesta = await axios.get(`${urlServidor}:${puerto}${rutaApi}`)
                return respuesta.data
            } catch (error) {
                console.log('heheheh')
                throw simplificarError(error)
            }
        },
        getByDni: async (unDni) => {
            try {
                const respuesta = await axios.get(`${urlServidor}:${puerto}${rutaApi}?dni=${unDni}`)
                return respuesta.data
            } catch (error) {
                throw simplificarError(error)
            }
        },
        post: async (unEstu) => {
            try {
                const respuesta = await axios.post(`${urlServidor}:${puerto}${rutaApi}`, unEstu)
                return respuesta.data
            } catch (error) {
                throw simplificarError(error)
            }
        }
    }
}

module.exports = { crearClienteRest }