const { request, response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const {ObjectId} = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino= '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino= '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        res.json({
            results: (categoria) ? [categoria]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({name: regex, estado: true});

    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino= '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'name');
        res.json({
            results: (producto) ? [producto]: []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({name: regex, estado: true})
                                    .populate('categoria', 'name');

    res.json({
        results: productos
    })
}

const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las coleeciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg:'Se le olvidó hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}