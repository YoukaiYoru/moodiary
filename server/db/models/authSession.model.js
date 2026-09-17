const { Model, DataTypes, Sequelize } = require('sequelize');

const AUTH_SESSION_TABLE = 'auth_sessions';

const AuthSessionSchema = {
  id: {
    allowNull: false,
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  user_id: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  expires_at: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class AuthSession extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: AUTH_SESSION_TABLE,
      modelName: 'AuthSession',
      timestamps: false,
    };
  }
}

module.exports = { AUTH_SESSION_TABLE, AuthSessionSchema, AuthSession };
