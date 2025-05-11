const { Model, DataTypes } = require('sequelize');

const MOOD_ENTRY_TAG_TABLE = 'mood_entry_tags';

const MoodEntryTagSchema = {
  entry_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  tag_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
};

class MoodEntryTag extends Model {
  static associate() {
    // No es necesario definir asociaciones aquí
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

module.exports = { MOOD_ENTRY_TAG_TABLE, MoodEntryTagSchema, MoodEntryTag };
