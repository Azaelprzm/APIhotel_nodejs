const express = require('express');
const Reserva = require('../models/Reserva');
const Pago = require('../models/Pago');
const Habitacion = require('../models/Habitacion');
const Cliente = require('../models/Cliente');
const Hotel = require('../models/Hotel');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear una nueva reserva
router.post('/', verifyToken, async (req, res) => {
  try {
    const { fechaInicio, fechaFin, clienteId, hotelId, habitacionId, metodoPago, pagoInicial = 0 } = req.body;

    // Validar fechas
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
    }

    // Calcular noches
    const noches = Math.ceil((fechaFinDate - fechaInicioDate) / (1000 * 60 * 60 * 24));

    // Verificar que la habitación exista
    const habitacion = await Habitacion.findByPk(habitacionId);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada.' });
    }

    // Calcular el total y el adeudo
    const total = noches * habitacion.costoPorNoche;
    const adeudo = total - pagoInicial;

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      fechaInicio,
      fechaFin,
      clienteId,
      hotelId,
      habitacionId,
      metodoPago,
      noches,
      total,
      adeudo,
    });

    // Registrar el pago inicial, si aplica
    if (pagoInicial > 0) {
      await Pago.create({
        monto: pagoInicial,
        metodo: metodoPago,
        tarjeta: metodoPago === 'tarjeta' ? req.body.tarjeta : null,
        reservaId: nuevaReserva.id,
      });
    }

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva.', error });
  }
});

// Obtener todas las reservas (con información extendida)
router.get('/', verifyToken, async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Cliente, attributes: ['nombre', 'email'] },
        { model: Hotel, attributes: ['nombre', 'direccion'] },
        { model: Habitacion, attributes: ['numero', 'tipo', 'costoPorNoche'] },
      ],
    });
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas.', error });
  }
});

// Obtener una reserva por ID (con información extendida)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id, {
      include: [
        { model: Cliente, attributes: ['nombre', 'email'] },
        { model: Hotel, attributes: ['nombre', 'direccion'] },
        { model: Habitacion, attributes: ['numero', 'tipo', 'costoPorNoche'] },
      ],
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la reserva.', error });
  }
});

// Actualizar una reserva por ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { fechaInicio, fechaFin, clienteId, hotelId, habitacionId, metodoPago, pagoInicial = 0 } = req.body;

    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Validar fechas
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
    if (fechaInicioDate >= fechaFinDate) {
      return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
    }

    // Calcular noches
    const noches = Math.ceil((fechaFinDate - fechaInicioDate) / (1000 * 60 * 60 * 24));

    // Verificar que la habitación exista
    const habitacion = await Habitacion.findByPk(habitacionId);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada.' });
    }

    // Calcular el total y el adeudo
    const total = noches * habitacion.costoPorNoche;
    const adeudo = total - pagoInicial;

    // Actualizar la reserva
    await reserva.update({
      fechaInicio,
      fechaFin,
      clienteId,
      hotelId,
      habitacionId,
      metodoPago,
      noches,
      total,
      adeudo,
    });

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la reserva.', error });
  }
});

// Eliminar una reserva por ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    await reserva.destroy();
    res.status(200).json({ message: 'Reserva eliminada.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reserva.', error });
  }
});

module.exports = router;
