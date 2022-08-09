const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El ${rol} no esta registrado en la BBDD`);
    }
}

const emailExiste = async(email='') => {
    const existeEmail = await Usuario.findOne({email});
    if (existeEmail) {
        throw new Error(`El ${email} ya existe`);
    }
}

const existeUsuarioById = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaById = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoById = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById
}