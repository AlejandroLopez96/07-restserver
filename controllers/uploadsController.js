const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {

    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({nombre})
    } catch(error) {
        res.status(400).json({error})
    }    
}

const actualizarImagen = async (req = request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }


            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // limpiar imagenes previas
    if (modelo.img) {
        // borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
    }

    const nombreFichero = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreFichero;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }


            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // limpiar imagenes previas
    if (modelo.img) {
        // borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async (req = request, res = response) => {
    
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                });
            }


            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Mostrar imagen del modelo
    if (modelo.img) {
        // mostrar imagen del modelo
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImage)){
            return res.sendFile(pathImage);
        }
    }

    const pathImageNoExist = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImageNoExist);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}