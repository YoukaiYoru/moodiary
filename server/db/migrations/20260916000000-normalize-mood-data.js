'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'mood_types',
      { mood_score: 3 },
      { name: 'Ansiedad' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { mood_score: 2 },
      { name: 'Enojo' },
    );
    await queryInterface.changeColumn('user_daily_quote', 'quote_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'mood_types',
      { mood_score: 2 },
      { name: 'Ansiedad' },
    );
    await queryInterface.bulkUpdate(
      'mood_types',
      { mood_score: 1 },
      { name: 'Enojo' },
    );
    await queryInterface.changeColumn('user_daily_quote', 'quote_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
