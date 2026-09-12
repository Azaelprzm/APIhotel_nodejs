const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Reserva = require('./Reserva');

const Pago = sequelize.define('Pago', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['tarjeta', 'efectivo']], // Métodos válidos
    },
  },
  tarjeta: {
    type: DataTypes.STRING,
    allowNull: true, // Solo requerido si el método es tarjeta
  },
  reservaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Reserva,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'Pagos',
});

Reserva.hasMany(Pago, { foreignKey: 'reservaId' });
Pago.belongsTo(Reserva, { foreignKey: 'reservaId' });

module.exports = Pago;
