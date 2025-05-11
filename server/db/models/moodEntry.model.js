const { Model, DataTypes, Sequelize } = require('sequelize');

const MOOD_ENTRY_TABLE = 'mood_entries';

const MoodEntrySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  user_id: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: 'user_profiles',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  mood_type_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'mood_types',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  note: {
    type: DataTypes.TEXT,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class MoodEntry extends Model {
  static associate(models) {
    this.belongsTo(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'user_profile',
    });
    this.belongsTo(models.MoodType, {
      foreignKey: 'mood_type_id',
      as: 'mood_type',
    });
    this.belongsToMany(models.Tag, {
      through: models.MoodEntryTag,
      foreignKey: 'entry_id',
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
