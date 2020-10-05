const express = require('express')

let wrap = fn => (...args) => fn(...args).catch(args[2])

function crearPacientesRouter({ aplicacion }) {
    router = express.Router()

    const pacientesApi = aplicacion

    router.get('/', wrap(async (req, res) => {
        const pacientes = await handleGet(pacientesApi, req.query)
        res.json(pacientes)
    }))

    router.post('/', wrap(async (req, res) => {
        const paciente = await pacientesApi.create(req.body)
        res.status(201).json(paciente)
    }))

    router.delete('/:id', wrap(async (req, res) => {
        await pacientesApi.deleteById(req.params.id)
        res.status(204).json()
    }))

    router.put('/:id', wrap(async (req, res) => {
        const paciente = await pacientesApi.replaceById(req.body, req.params.id)
        res.json(paciente)
    }))

    return router
}

async function handleGet(api, query) {
    if (query.dni) {
        return await api.getByDni(query.dni)
    }

    if (query.desde && query.hasta) {
        const rango = {
            desde: query.desde,
            hasta: query.hasta
        }
        return await api.getByAge(rango)
    }

    return await api.getAll()
}

module.exports = { crearPacientesRouter }