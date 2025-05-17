'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('mood_types', 'emoji', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '', // valor por defecto temporal
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('mood_types', 'emoji', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
