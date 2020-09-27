function crearDaoMemoria() {


    const elementos = []

    return {


        getAll: async () => { return elementos },


        add: () => { },
        deleteAll: () => { },
        connect: async () => { },
        close: async () => { }
    }
}


exports.crearDaoMemoria = crearDaoMemoria