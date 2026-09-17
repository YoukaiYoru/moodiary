'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_profiles', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('user_profiles', 'password_hash', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('user_profiles', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
    await queryInterface.addIndex('user_profiles', ['email'], {
      unique: true,
      name: 'user_profiles_email_unique',
      where: { email: { [Sequelize.Op.ne]: null } },
    });

    await queryInterface.createTable('auth_sessions', {
      id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
      user_id: { type: Sequelize.STRING, allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addConstraint('auth_sessions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_auth_sessions_user_id',
      references: { table: 'user_profiles', field: 'user_id' },
      onDelete: 'CASCADE',
    });
    await queryInterface.addIndex('auth_sessions', ['user_id'], {
      name: 'auth_sessions_user_id_idx',
    });
    await queryInterface.addIndex('auth_sessions', ['expires_at'], {
      name: 'auth_sessions_expires_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auth_sessions');
    await queryInterface.removeIndex('user_profiles', 'user_profiles_email_unique');
    await queryInterface.removeColumn('user_profiles', 'updated_at');
    await queryInterface.removeColumn('user_profiles', 'password_hash');
    await queryInterface.removeColumn('user_profiles', 'email');
  },
};
