const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verificar que el encabezado de autorización esté presente y tenga el formato correcto
  if (!authHeader) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }
  
  // Extraer el token del encabezado, eliminando la palabra "Bearer "
  const token = authHeader.split(' ')[1];
  
  // Comprobar si el token está presente
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado o malformado' });
  }

  try {
    // Verificar y decodificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Almacenar el ID del usuario decodificado en la solicitud para usarlo más adelante
    req.userId = decoded.id;
    
    // Continuar al siguiente middleware o controlador de la ruta
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
