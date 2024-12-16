const express = require('express');
const morgan = require('morgan');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const habitacionRoutes = require('./routes/habitacionRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const pagoRoutes = require('./routes/pagosRoutes');
const verifyToken = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware para mostrar peticiones en la consola
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));


// Middlewares
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Gestión Hotelera funcionando correctamente');
});

app.get('/api/test', verifyToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', userId: req.userId });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/hoteles', hotelRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pagos', pagoRoutes);

// Sincronizar la base de datos
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Error al sincronizar la base de datos:', error));
