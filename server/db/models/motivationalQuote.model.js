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
  mood_score_target: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class MotivationalQuote extends Model {
  static associate(models) {
    this.hasMany(models.UserDailyQuote, {
      foreignKey: 'quote_id',
      as: 'daily_quotes',
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
