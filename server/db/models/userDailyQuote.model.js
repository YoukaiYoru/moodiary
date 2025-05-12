const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_DAILY_QUOTE_TABLE = 'user_daily_quote';

const UserDailyQuoteSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quote_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quote_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
};

class UserDailyQuote extends Model {
  static associate(models) {
    this.belongsTo(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(models.MotivationalQuote, {
      foreignKey: 'quote_id',
      as: 'quote',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_DAILY_QUOTE_TABLE,
      modelName: 'UserDailyQuote',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'quote_date'],
        },
      ],
    };
  }
}

module.exports = {
  UserDailyQuote,
  UserDailyQuoteSchema,
  USER_DAILY_QUOTE_TABLE,
};
