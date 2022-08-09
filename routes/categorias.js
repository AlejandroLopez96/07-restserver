const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, categoriasDelete, actualizarCategoria } = require('../controllers/categoriasController');
const { existeCategoriaById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, tieneRol, esAdminRole } = require('../middlewares');

const router = new Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaById)
], obtenerCategoria);

// crear catergoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// editar categoria - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaById),
    validarCampos
], actualizarCategoria);

// borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], categoriasDelete);

module.exports = router;