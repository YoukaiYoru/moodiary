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

    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '😄', mood_score: 5 },
      { name: 'Alegría' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '😌', mood_score: 4 },
      { name: 'Calma' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '😰', mood_score: 2 },
      { name: 'Ansiedad' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '😢', mood_score: 1 },
      { name: 'Tristeza' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '😠', mood_score: 1 },
      { name: 'Enojo' },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkUpdate(
      'mood_types',
      { emoji: '', mood_score: null },
      {},
    );
  },
};
