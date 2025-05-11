const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_DAILY_QUOTE_TABLE = 'user_daily_quote';

const UserDailyQuoteSchema = {
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
  quoteId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'quote_id',
  },
  quoteDate: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    field: 'quote_date',
    defaultValue: Sequelize.NOW,
  },
};

class UserDailyQuote extends Model {
  static associate(models) {
    this.belongsTo(models.UserProfile, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.MotivationalQuote, {
      foreignKey: 'quoteId',
      as: 'quote',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_DAILY_QUOTE_TABLE,
      modelName: 'UserDailyQuote',
      timestamps: false,
    };
  }
}

module.exports = {
  USER_DAILY_QUOTE_TABLE,
  UserDailyQuoteSchema,
  UserDailyQuote,
};
