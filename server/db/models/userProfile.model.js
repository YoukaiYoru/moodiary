const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_PROFILE_TABLE = 'user_profiles';

const UserProfileSchema = {
  user_id: {
    allowNull: false,
    type: DataTypes.STRING, // Clerk usa STRING para el ID de usuario
    primaryKey: true,
  },
  display_name: {
    type: DataTypes.TEXT,
  },
  preferred_mood: {
    type: DataTypes.TEXT,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class UserProfile extends Model {
  static associate(models) {
    this.hasMany(models.MoodEntry, {
      foreignKey: 'user_id',
      as: 'mood_entries',
    });
    this.hasMany(models.UserDailyQuote, {
      foreignKey: 'user_id',
      as: 'daily_quotes',
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
