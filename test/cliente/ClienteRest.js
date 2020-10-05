const axios = require('axios').default

async function sendRequest(req) {
    try {
        const result = await axios(req)
        return result
    } catch (error) {
        if (error.response) {
            const NE = new Error(`error ${error.response.status} enviado desde el servidor: ${error.response.data.message}`)
            NE.status = error.response.status
            NE.message = error.response.data.message
            throw NE
        } else {
            throw new Error('error al enviar la peticion')
        }
    }
}

function makeUrl(port, recurso) {
    return `http://localhost:${port}/api/${recurso}`
}

function crearClienteRest(port, recurso) {

    return {
        getAll: async () => {
            return await sendRequest({ url: makeUrl(port, recurso) })
        },
        getByDni: async (unDni) => {
            return await sendRequest({ url: makeUrl(port, recurso), params: { dni: unDni } })
        },
        post: async (modelo) => {
            return await sendRequest({ url: makeUrl(port, recurso), method: 'post', data: modelo })
        },
        put: async (modelo) => {
            return await sendRequest({ url: makeUrl(port, recurso) + `/${modelo.id}`, method: 'put', data: modelo })
        },
        getByAge: async ({ desde, hasta }) => {
            return await sendRequest({ url: makeUrl(port, recurso), params: { desde, hasta } })
        },
        deleteById: async (unId) => {
            return await sendRequest({ url: makeUrl(port, recurso) + `/${unId}`, method: 'delete' })
        }
    }
}

module.exports = { crearClienteRest }