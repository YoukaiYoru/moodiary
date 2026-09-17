const { Model, DataTypes } = require('sequelize');

const MOOD_ENTRY_TAG_TABLE = 'mood_entry_tags';

const MoodEntryTagSchema = {
  entry_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  tag_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
};

class MoodEntryTag extends Model {
  static associate() {
    // La relación pertenece a una entrada; el acceso se valida por user_id en los servicios.
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOOD_ENTRY_TAG_TABLE,
      modelName: 'MoodEntryTag',
      timestamps: false,
    };
  }
}

module.exports = { MoodEntryTag, MoodEntryTagSchema, MOOD_ENTRY_TAG_TABLE };
