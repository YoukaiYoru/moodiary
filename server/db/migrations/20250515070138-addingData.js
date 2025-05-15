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
    await queryInterface.bulkInsert(
      'mood_types',
      [
        { name: 'Alegría', mood_score: 5 },
        { name: 'Calma', mood_score: 4 },
        { name: 'Ansiedad', mood_score: 2 },
        { name: 'Tristeza', mood_score: 1 },
        { name: 'Enojo', mood_score: 2 },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkDelete(
      'mood_types',
      {
        name: ['Alegría', 'Calma', 'Ansiedad', 'Tristeza', 'Enojo'],
      },
      {},
    );
  },
};
