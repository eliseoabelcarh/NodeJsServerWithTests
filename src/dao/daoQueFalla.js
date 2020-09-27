function crearDaoDbQueFalla() {

    //CREAR INSTANCIA DE CLIENTE DB
    const client = new AlgoQueFalle()

    return {
        getAll: () => { },
        add: () => { },
        deleteAll: () => { },
        connect: async () => { await client.connect() },
        close: async () => { await client.close() }
    }
}


exports.crearDaoDbQueFalla = crearDaoDbQueFalla