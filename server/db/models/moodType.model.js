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
    type: DataTypes.TEXT,
    unique: true,
  },
  mood_score: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
};

class MoodType extends Model {
  static associate(models) {
    this.hasMany(models.MoodEntry, {
      foreignKey: 'mood_type_id',
      as: 'mood_entries',
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
