const express = require('express');
const Cliente = require('../models/Cliente');
const verifyToken = require('../middlewares/authMiddleware'); // Importar el middleware de autenticación
const router = express.Router();

// Crear un nuevo cliente (protegido)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const nuevoCliente = await Cliente.create({ nombre, email, telefono });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error });
  }
});

// Obtener todos los clientes (protegido)
router.get('/', verifyToken, async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
});

// Obtener un cliente por ID (protegido)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
});

// Actualizar un cliente por ID (protegido)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.update({ nombre, email, telefono });
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error });
  }
});

// Eliminar un cliente por ID (protegido)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: 'Cliente eliminado' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
});

module.exports = router;
