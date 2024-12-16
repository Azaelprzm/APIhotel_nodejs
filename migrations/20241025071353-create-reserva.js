'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      fechaInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fechaFin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      clienteId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clientes',
          key: 'id'
        },
        allowNull: false
      },
      hotelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hoteles',
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reservas');
  }
};
