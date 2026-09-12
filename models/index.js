'use strict';

// Los modelos exportan instancias, no funciones de fábrica.
module.exports = {
  Usuario: require('./Usuario'),
  Hotel: require('./Hotel'),
  Habitacion: require('./Habitacion'),
  Cliente: require('./Cliente'),
  Reserva: require('./Reserva'),
  Pago: require('./Pago'),
  sequelize: require('../config/database'),
  Sequelize: require('sequelize').Sequelize,
};
