function crearDaoDb() {

    //CREAR INSTANCIA DE CLIENTE DB
    const client = new ALGO()
    //const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true })

    return {
        getAll: () => { },
        add: () => { },
        deleteAll: () => { },
        connect: async () => { await client.connect() },
        close: async () => { await client.close() }
    }
}


exports.crearDaoDb = crearDaoDb