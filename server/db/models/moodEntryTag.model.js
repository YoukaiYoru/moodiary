const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_ENTRY_TAG_TABLE = 'mood_entry_tags';

const MoodEntryTagSchema = {
  entryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'entry_id',
    primaryKey: true,
  },
  tagId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'tag_id',
    primaryKey: true,
  },
};

class MoodEntryTag extends Model {
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
