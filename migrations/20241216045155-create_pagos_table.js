'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pagos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      monto: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      metodo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tarjeta: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reservaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reservas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pagos');
  },
};
