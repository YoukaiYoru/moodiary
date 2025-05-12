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
  // Inicialización
  UserProfile.init(UserProfileSchema, UserProfile.config(sequelize));
  MoodType.init(MoodTypeSchema, MoodType.config(sequelize));
  MoodEntry.init(MoodEntrySchema, MoodEntry.config(sequelize));
  MotivationalQuote.init(
    MotivationalQuoteSchema,
    MotivationalQuote.config(sequelize),
  );
  UserDailyQuote.init(UserDailyQuoteSchema, UserDailyQuote.config(sequelize));
  Tag.init(TagSchema, Tag.config(sequelize));
  MoodEntryTag.init(MoodEntryTagSchema, MoodEntryTag.config(sequelize));

  // Asociaciones
  UserProfile.associate(sequelize.models);
  MoodType.associate(sequelize.models);
  MoodEntry.associate(sequelize.models);
  MotivationalQuote.associate(sequelize.models);
  UserDailyQuote.associate(sequelize.models);
  Tag.associate(sequelize.models);
  MoodEntryTag.associate?.(sequelize.models); // opcional en caso no tenga asociaciones directas
}

module.exports = setupModels;
