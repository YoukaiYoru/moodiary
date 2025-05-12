const { Model, DataTypes, Sequelize } = require('sequelize');

const TAG_TABLE = 'tags';

const TagSchema = {
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
};

class Tag extends Model {
  static associate(models) {
    this.belongsToMany(models.MoodEntry, {
      through: models.MoodEntryTag,
      foreignKey: 'tag_id',
      otherKey: 'entry_id',
      as: 'entries',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TAG_TABLE,
      modelName: 'Tag',
      timestamps: false,
    };
  }
}

module.exports = { Tag, TagSchema, TAG_TABLE };
