
const valido = {
    nombre: 'mariano',
    apellido: 'aquino',
    edad: 34,
    dni: '123'
}

const valido2 = {
    nombre: 'juana',
    apellido: 'perez',
    edad: 36,
    dni: '456'
}


const sinCampoNombre = {
    apellido: 'perez',
    edad: 36,
    dni: '456'
}
const sinCampoApellido = {
    nombre: 'juana',
    edad: 36,
    dni: '456'
}
const sinCampoEdad = {
    nombre: 'juana',
    apellido: 'perez',
    dni: '456'
}
const sinCampoDni = {
    nombre: 'juana',
    apellido: 'perez',
    edad: 36
}

const conDniNoNumerico = {
    nombre: 'juana',
    apellido: 'perez',
    edad: 36,
    dni: 'DniSinNumeros'
}

const conEdadNoNumerico = {
    nombre: 'juana',
    apellido: 'perez',
    edad: 'NoNumerico',
    dni: '456'
}

const model = {
    valido, valido2, sinCampoNombre, sinCampoApellido, sinCampoEdad, sinCampoDni,
    conDniNoNumerico, conEdadNoNumerico
}

module.exports = model