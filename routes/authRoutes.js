const express = require('express');
const { register, login } = require('../controllers/authController');
const { listarUsuarios } = require('../controllers/usuarioController');
const verifyToken = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Ruta para listar usuarios (solo accesible si se está autenticado)
router.get('/usuarios', verifyToken, listarUsuarios);

module.exports = router;
