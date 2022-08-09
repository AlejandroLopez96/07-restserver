const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, productosDelete, actualizarProducto } = require('../controllers/productosController');
const { existeProductoById, existeCategoriaById, nombreProductoExiste } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRol, esAdminRole } = require('../middlewares');

const router = new Router();

// obtener todas las categorias - publico
router.get('/', obtenerProductos);

// obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoById)
], obtenerProducto);

// crear catergoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto);

// editar categoria - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], actualizarProducto);

// borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], productosDelete);

module.exports = router;