const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuariosController');
const { esRolValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('email', 'El correo no es válido').isEmail(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({min:6}),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    check('email').custom(emailExiste),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;