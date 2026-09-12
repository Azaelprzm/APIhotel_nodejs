const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Hotel = require('./Hotel');
const Habitacion = require('./Habitacion');

const Reserva = sequelize.define('Reserva', {
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  noches: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adeudo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cliente,
      key: 'id',
    },
    allowNull: false,
  },
  hotelId: {
    type: DataTypes.INTEGER,
    references: {
      model: Hotel,
      key: 'id',
    },
    allowNull: false,
  },
  habitacionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Habitacion,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'Reservas',
});

Cliente.hasMany(Reserva, { foreignKey: 'clienteId' });
Hotel.hasMany(Reserva, { foreignKey: 'hotelId' });
Habitacion.hasMany(Reserva, { foreignKey: 'habitacionId' });

Reserva.belongsTo(Cliente, { foreignKey: 'clienteId' });
Reserva.belongsTo(Hotel, { foreignKey: 'hotelId' });
Reserva.belongsTo(Habitacion, { foreignKey: 'habitacionId' });

module.exports = Reserva;
