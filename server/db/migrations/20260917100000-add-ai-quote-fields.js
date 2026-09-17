'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_daily_quote', 'message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('user_daily_quote', 'source', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'database',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_daily_quote', 'source');
    await queryInterface.removeColumn('user_daily_quote', 'message');
  },
};
