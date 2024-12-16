const express = require('express');
const { realizarPago, obtenerPagosPorReserva } = require('../controllers/pagoController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para registrar un pago para una reserva
router.post('/', verifyToken, realizarPago);

// Ruta para obtener todos los pagos asociados a una reserva
router.get('/:reservaId', verifyToken, obtenerPagosPorReserva);

module.exports = router;
