const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

router.post('/login', [
    check('email', 'El emai es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;