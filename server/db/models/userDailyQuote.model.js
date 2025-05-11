const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_DAILY_QUOTE_TABLE = 'user_daily_quote';

const UserDailyQuoteSchema = {
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

  quote_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  quote_date: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    defaultValue: Sequelize.literal('CURRENT_DATE'),
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
  USER_DAILY_QUOTE_TABLE,
  UserDailyQuoteSchema,
  UserDailyQuote,
};
