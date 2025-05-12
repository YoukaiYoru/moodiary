const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_TYPE_TABLE = 'mood_types';

const MoodTypeSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  mood_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
      as: 'entries',
      onDelete: 'CASCADE',
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

module.exports = { MoodType, MoodTypeSchema, MOOD_TYPE_TABLE };
