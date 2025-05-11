const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_PROFILE_TABLE = 'user_profiles';
const UserProfileSchema = {
  userId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
    field: 'user_id',
  },
  displayName: {
    type: DataTypes.STRING,
    field: 'display_name',
  },
  preferredMood: {
    type: DataTypes.STRING,
    field: 'preferred_mood',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class UserProfile extends Model {
  static associate(models) {
    this.hasMany(models.MoodEntry, { foreignKey: 'userId', as: 'moodEntries' });
    this.hasMany(models.UserDailyQuote, {
      foreignKey: 'userId',
      as: 'dailyQuotes',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_PROFILE_TABLE,
      modelName: 'UserProfile',
      timestamps: false,
    };
  }
}

module.exports = { USER_PROFILE_TABLE, UserProfileSchema, UserProfile };
