'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservas', 'habitacionId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Habitaciones',
        key: 'id',
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Reservas', 'noches', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn('Reservas', 'total', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn('Reservas', 'metodoPago', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Reservas', 'adeudo', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservas', 'habitacionId');
    await queryInterface.removeColumn('Reservas', 'noches');
    await queryInterface.removeColumn('Reservas', 'total');
    await queryInterface.removeColumn('Reservas', 'metodoPago');
    await queryInterface.removeColumn('Reservas', 'adeudo');
  },
};
