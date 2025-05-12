const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_ENTRY_TABLE = 'mood_entries';

const MoodEntrySchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mood_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

class MoodEntry extends Model {
  static associate(models) {
    this.belongsTo(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(models.MoodType, {
      foreignKey: 'mood_type_id',
      as: 'moodType',
    });

    this.belongsToMany(models.Tag, {
      through: models.MoodEntryTag,
      foreignKey: 'entry_id',
      otherKey: 'tag_id',
      as: 'tags',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOOD_ENTRY_TABLE,
      modelName: 'MoodEntry',
      timestamps: false,
    };
  }
}

module.exports = { MoodEntry, MoodEntrySchema, MOOD_ENTRY_TABLE };
