const {
    crearErrorArgumentosInvalidos,
    crearErrorRecursoNoEncontrado
} = require('../../compartido/errores/ApiError.js')

async function crearPacientesDaoMemoria() {


    const elementos = []

    const daoMemoria = {
        /*   add: async () => {
              elementos.push(elemento)
          }, */
        addUnique: async (elemento, claveUnica) => {
            const existe = elementos.some(e => {
                return e[claveUnica] === elemento[claveUnica]
            })
            if (existe) {
                throw crearErrorArgumentosInvalidos(claveUnica, 'debe ser unico')
            }
            elementos.push(elemento)
        },
        /* addAll: async (elementosNuevos) => {
            elementosNuevos.forEach(e => elementos.push(e))
        }, */
        getAll: async () => {
            return [...elementos]
        },
        getByDni: async (dni) => {
            return elementos.filter(e => e.dni === dni)
        },
        getByAge: async ({ desde, hasta }) => {
            return elementos.filter(e => e.edad >= desde && e.edad <= hasta)
        },
        deleteById: async (unId) => {
            const indiceParaBorrar = elementos.findIndex(e => e.id == unId)
            if (indiceParaBorrar === -1) {
                throw crearErrorRecursoNoEncontrado('estudiante', unId)
            }
            elementos.splice(indiceParaBorrar, 1)
        },
        updateById: async (elemento) => {
            const indiceParaReemplazar = elementos.findIndex(e => e.id == elemento.id)
            if (indiceParaReemplazar === -1) {
                throw crearErrorRecursoNoEncontrado('paciente', elemento.id)
            }
            elementos.splice(indiceParaReemplazar, 1, elemento)
        },
        deleteAll: async () => {
            while (elementos.length > 0) {
                elementos.pop()
            }
        },
        close: async () => { }
    }
    return daoMemoria
}

module.exports = { crearPacientesDaoMemoria }