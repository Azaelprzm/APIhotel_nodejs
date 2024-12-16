const express = require('express');
const Hotel = require('../models/Hotel');
const verifyToken = require('../middlewares/authMiddleware'); // Importar el middleware de autenticación
const router = express.Router();

// Crear un nuevo hotel (protegido)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, direccion, telefono, estrellas } = req.body;
    const nuevoHotel = await Hotel.create({ nombre, direccion, telefono, estrellas });
    res.status(201).json(nuevoHotel);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el hotel', error });
  }
});

// Obtener todos los hoteles (protegido)
router.get('/', verifyToken, async (req, res) => {
  try {
    const hoteles = await Hotel.findAll();
    res.status(200).json(hoteles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los hoteles', error });
  }
});

// Obtener un hotel por ID (protegido)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el hotel', error });
  }
});

// Actualizar un hotel por ID (protegido)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, direccion, telefono, estrellas } = req.body;
    const hotel = await Hotel.findByPk(req.params.id);
    if (hotel) {
      await hotel.update({ nombre, direccion, telefono, estrellas });
      res.status(200).json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el hotel', error });
  }
});

// Eliminar un hotel por ID (protegido)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (hotel) {
      await hotel.destroy();
      res.status(200).json({ message: 'Hotel eliminado' });
    } else {
      res.status(404).json({ message: 'Hotel no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el hotel', error });
  }
});

module.exports = router;
