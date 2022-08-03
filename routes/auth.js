const {Router} = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

router.post('/login', [
    check('email', 'El emai es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

module.exports = router;