const { Model, DataTypes, Sequelize } = require('sequelize');
const MOTIVATIONAL_QUOTE_TABLE = 'motivational_quotes';

const MotivationalQuoteSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  message: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  moodScoreTarget: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'mood_score_target',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class MotivationalQuote extends Model {
  static associate(models) {
    this.hasMany(models.UserDailyQuote, {
      foreignKey: 'quoteId',
      as: 'userQuotes',
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
  MOTIVATIONAL_QUOTE_TABLE,
  MotivationalQuoteSchema,
  MotivationalQuote,
};
