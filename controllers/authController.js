const { response, request, json } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async(req = request, res = response) => {
    const {id_token} = req.body;

    try {

        const {name, img, email} = await googleVerify(id_token);

        console.log(name + '\n' + img + '\n' + email);

        let usuario = await Usuario.findOne({email});

        if (!usuario) {
            // Se crea
            const data = {
                name,
                email,
                password: ':P',
                img,
                status: true,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en db esta desactivado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no pudo ser validado'
        })
    }

    
}

module.exports = {
    login,
    googleSignIn
}