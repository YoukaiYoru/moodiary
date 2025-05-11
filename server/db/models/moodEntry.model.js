const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_ENTRY_TABLE = 'mood_entries';

const MoodEntrySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'user_id',
  },
  moodTypeId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'mood_type_id',
  },
  note: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class MoodEntry extends Model {
  static associate(models) {
    this.belongsTo(models.UserProfile, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.MoodType, {
      foreignKey: 'moodTypeId',
      as: 'moodType',
    });
    this.belongsToMany(models.Tag, {
      through: models.MoodEntryTag,
      foreignKey: 'entryId',
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
module.exports = { MOOD_ENTRY_TABLE, MoodEntrySchema, MoodEntry };
