'use strict';

const {
  USER_PROFILE_TABLE,
  UserProfileSchema,
} = require('../models/userProfile.model');

const { MOOD_TYPE_TABLE, MoodTypeSchema } = require('../models/moodType.model');

const {
  MOOD_ENTRY_TABLE,
  MoodEntrySchema,
} = require('../models/moodEntry.model');

const {
  MOTIVATIONAL_QUOTE_TABLE,
  MotivationalQuoteSchema,
} = require('../models/motivationalQuote.model');

const {
  USER_DAILY_QUOTE_TABLE,
  UserDailyQuoteSchema,
} = require('../models/userDailyQuote.model');

const { TAG_TABLE, TagSchema } = require('../models/tag.model');

const {
  MOOD_ENTRY_TAG_TABLE,
  MoodEntryTagSchema,
} = require('../models/moodEntryTag.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_PROFILE_TABLE, UserProfileSchema);

    await queryInterface.createTable(
      USER_DAILY_QUOTE_TABLE,
      UserDailyQuoteSchema,
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_DAILY_QUOTE_TABLE);
    await queryInterface.dropTable(USER_PROFILE_TABLE);
  },
};
