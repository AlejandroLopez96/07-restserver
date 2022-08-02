const {response, request} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const {limite=5, desde=0} = req.query;
    const filter = {estado:true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(filter),
        Usuario.find(filter)
        .skip(Number(desde))    
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, email, ...resto} = req.body;

    // validar contra bbdd
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - controlador',
        usuario
    })
}

const usuariosPost = async (req, res = response) => {

    const {name, email, password, rol} = req.body;
    const usuario = new Usuario({name, email, password, rol});

    // encriptar la password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    // guardar en bbdd
    await usuario.save();

    res.json({
        msg: 'post API - controlador',
        usuario
    })
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    // fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json(usuario)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}