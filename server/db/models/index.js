const { UserProfile, UserProfileSchema } = require('./userProfile.model');
const { MoodEntry, MoodEntrySchema } = require('./moodEntry.model');
const { MoodType, MoodTypeSchema } = require('./moodType.model');
const {
  MotivationalQuote,
  MotivationalQuoteSchema,
} = require('./motivationalQuote.model');
const { MoodEntryTag, MoodEntryTagSchema } = require('./moodEntryTag.model');
const { Tag, TagSchema } = require('./tag.model');
const {
  UserDailyQuote,
  UserDailyQuoteSchema,
} = require('./userDailyQuote.model');

function setupModels(sequelize) {
  // Inicialización de los modelos
  UserProfile.init(UserProfileSchema, UserProfile.config(sequelize));
  UserDailyQuote.init(UserDailyQuoteSchema, UserDailyQuote.config(sequelize));

  UserProfile.associate(sequelize.models);
  UserDailyQuote.associate(sequelize.models);
}

module.exports = setupModels;
