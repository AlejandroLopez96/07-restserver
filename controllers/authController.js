const { response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
    
    const {email, password} = req.body;
    
    try {

        // verificar si email existe
        const usuario = await Usuario.findOne({email});

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        // si usuario esta activo en bbdd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // verificar password
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - PASSWORD INCORRECTO'
            })
        }
        
        // generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
}

module.exports = {
    login
}