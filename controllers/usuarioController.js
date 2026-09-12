const Usuario = require('../models/Usuario');

// Listar todos los usuarios (solo accesible con un token válido)
const listarUsuarios = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email'], // Opcionalmente puedes especificar los campos que quieres retornar
    });
    res.status(200).json(usuarios); // Devolver los usuarios
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};

module.exports = { listarUsuarios };
