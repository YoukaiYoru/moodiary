const { Model, DataTypes, Sequelize } = require('sequelize');

const MOTIVATIONAL_QUOTE_TABLE = 'motivational_quotes';

const MotivationalQuoteSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mood_score_target: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

class MotivationalQuote extends Model {
  static associate(models) {
    this.hasMany(models.UserDailyQuote, {
      foreignKey: 'quote_id',
      as: 'dailyUses',
      onDelete: 'SET NULL',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOTIVATIONAL_QUOTE_TABLE,
      modelName: 'MotivationalQuote',
      timestamps: false,
    };
  }
}

module.exports = {
  MotivationalQuote,
  MotivationalQuoteSchema,
  MOTIVATIONAL_QUOTE_TABLE,
};
