const { Model, DataTypes } = require('sequelize');

const TAG_TABLE = 'tags';

const TagSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    unique: true,
    type: DataTypes.TEXT,
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

module.exports = { TAG_TABLE, TagSchema, Tag };
