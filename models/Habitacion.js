const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Hotel = require('./Hotel');

const Habitacion = sequelize.define('Habitacion', {
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'unique_habitacion_hotel', // Garantiza que el número sea único por hotel
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  costoPorNoche: {
    type: DataTypes.FLOAT,
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
}, {
  tableName: 'Habitaciones',
});

Hotel.hasMany(Habitacion, { foreignKey: 'hotelId' });
Habitacion.belongsTo(Hotel, { foreignKey: 'hotelId' });

module.exports = Habitacion;
