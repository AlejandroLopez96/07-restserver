const { request, response } = require("express");
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res= response) => {
    const {limite=5, desde=0} = req.query;
    const filter = {estado:true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(filter),
        Categoria.find(filter)
        .populate('usuario', 'name')
        .skip(Number(desde))    
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })
}
// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res= response) => {

    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'name');

    res.json(categoria);
}

const crearCategoria = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.name} ya existe`
        })
    }

    // generar data a guardar
    const data = {
        name,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // guardar db
    await categoria.save();

    res.status(201).json({
        msg: `Se ha creado la categoria ${name} correctamente`
    })
}

// actualizar categoria solo recibe nombre
const actualizarCategoria = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}

// borrar categoria - estado: false
const categoriasDelete = async (req = request, res = response) => {

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});

    res.json(categoria)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    categoriasDelete,
    actualizarCategoria
}