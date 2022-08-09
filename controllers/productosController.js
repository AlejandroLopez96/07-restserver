const { request, response } = require("express");
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res= response) => {
    const {limite=5, desde=0} = req.query;
    const filter = {estado:true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
        .populate('usuario', 'name')
        .populate('categoria', 'name')
        .skip(Number(desde))    
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}
// obtenerProducto - populate {}
const obtenerProducto = async (req = request, res= response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'name').populate('categoria', 'name');

    res.json(producto);
}

const crearProducto = async (req = request, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({name: body.name});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.name} ya existe`
        })
    }

    // generar data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // guardar db
    await producto.save();

    res.status(201).json(producto)
}

// actualizar Producto solo recibe nombre
const actualizarProducto = async (req = request, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

// borrar Producto - estado: false
const productosDelete = async (req = request, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false});

    res.json(producto)
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    productosDelete,
    actualizarProducto
}