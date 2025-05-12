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
    await queryInterface.createTable(MOOD_TYPE_TABLE, MoodTypeSchema);
    await queryInterface.createTable(
      MOTIVATIONAL_QUOTE_TABLE,
      MotivationalQuoteSchema,
    );
    await queryInterface.createTable(MOOD_ENTRY_TABLE, MoodEntrySchema);
    await queryInterface.createTable(
      USER_DAILY_QUOTE_TABLE,
      UserDailyQuoteSchema,
    );
    await queryInterface.createTable(TAG_TABLE, TagSchema);
    await queryInterface.createTable(MOOD_ENTRY_TAG_TABLE, MoodEntryTagSchema);

    // Add foreign key constraints for mood_entries
    await queryInterface.addConstraint(MOOD_ENTRY_TABLE, {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_mood_entries_user_id',
      references: {
        table: USER_PROFILE_TABLE,
        field: 'user_id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint(MOOD_ENTRY_TABLE, {
      fields: ['mood_type_id'],
      type: 'foreign key',
      name: 'fk_mood_entries_mood_type_id',
      references: {
        table: MOOD_TYPE_TABLE,
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    // Add foreign key constraints for user_daily_quote
    await queryInterface.addConstraint(USER_DAILY_QUOTE_TABLE, {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_daily_quote_user_id',
      references: {
        table: USER_PROFILE_TABLE,
        field: 'user_id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint(USER_DAILY_QUOTE_TABLE, {
      fields: ['quote_id'],
      type: 'foreign key',
      name: 'fk_user_daily_quote_quote_id',
      references: {
        table: MOTIVATIONAL_QUOTE_TABLE,
        field: 'id',
      },
      onDelete: 'SET NULL',
    });

    // Add foreign key constraints for mood_entry_tags
    await queryInterface.addConstraint(MOOD_ENTRY_TAG_TABLE, {
      fields: ['entry_id'],
      type: 'foreign key',
      name: 'fk_mood_entry_tags_entry_id',
      references: {
        table: MOOD_ENTRY_TABLE,
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint(MOOD_ENTRY_TAG_TABLE, {
      fields: ['tag_id'],
      type: 'foreign key',
      name: 'fk_mood_entry_tags_tag_id',
      references: {
        table: TAG_TABLE,
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(MOOD_ENTRY_TAG_TABLE);
    await queryInterface.dropTable(TAG_TABLE);
    await queryInterface.dropTable(USER_DAILY_QUOTE_TABLE);
    await queryInterface.dropTable(MOOD_ENTRY_TABLE);
    await queryInterface.dropTable(MOTIVATIONAL_QUOTE_TABLE);
    await queryInterface.dropTable(MOOD_TYPE_TABLE);
    await queryInterface.dropTable(USER_PROFILE_TABLE);
  },
};
