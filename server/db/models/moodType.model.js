const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_TYPE_TABLE = 'mood_types';

const MoodTypeSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  moodScore: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'mood_score',
  },
};

class MoodType extends Model {
  static associate(models) {
    this.hasMany(models.MoodEntry, {
      foreignKey: 'moodTypeId',
      as: 'moodEntries',
    });
    this.hasMany(models.MotivationalQuote, {
      foreignKey: 'moodScoreTarget',
      as: 'quotes',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOOD_TYPE_TABLE,
      modelName: 'MoodType',
      timestamps: false,
    };
  }
}

module.exports = { MOOD_TYPE_TABLE, MoodTypeSchema, MoodType };
