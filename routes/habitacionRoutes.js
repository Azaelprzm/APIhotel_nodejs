const express = require('express');
const Habitacion = require('../models/Habitacion');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Crear una nueva habitación
router.post('/', verifyToken, async (req, res) => {
  try {
    const { numero, tipo, costoPorNoche, hotelId } = req.body;
    const nuevaHabitacion = await Habitacion.create({ numero, tipo, costoPorNoche, hotelId });
    res.status(201).json(nuevaHabitacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la habitación', error });
  }
});

// Obtener todas las habitaciones
router.get('/', verifyToken, async (req, res) => {
  try {
    const habitaciones = await Habitacion.findAll();
    res.status(200).json(habitaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las habitaciones', error });
  }
});

// Obtener una habitación por ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const habitacion = await Habitacion.findByPk(req.params.id);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la habitación', error });
  }
});

// Actualizar una habitación por ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { numero, tipo, costoPorNoche, hotelId } = req.body;
    const habitacion = await Habitacion.findByPk(req.params.id);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    await habitacion.update({ numero, tipo, costoPorNoche, hotelId });
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la habitación', error });
  }
});

// Eliminar una habitación por ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const habitacion = await Habitacion.findByPk(req.params.id);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    await habitacion.destroy();
    res.status(200).json({ message: 'Habitación eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la habitación', error });
  }
});

module.exports = router;
