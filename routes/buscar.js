const {Router} = require('express');
const { buscar } = require('../controllers/buscarController');

const router = new Router();

router.get('/:coleccion/:termino', buscar);

module.exports = router;