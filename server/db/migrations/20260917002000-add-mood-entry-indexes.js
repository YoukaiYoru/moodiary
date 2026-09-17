'use strict';

/**
 * Índices para las consultas más frecuentes del dashboard.
 * El orden user_id -> created_at favorece tanto el historial por usuario
 * como los rangos temporales de gráficos y promedios.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('mood_entries', ['user_id', 'created_at'], {
      name: 'idx_mood_entries_user_created_at',
    });
    await queryInterface.addIndex('mood_entries', ['user_id', 'mood_type_id'], {
      name: 'idx_mood_entries_user_mood_type',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'mood_entries',
      'idx_mood_entries_user_mood_type',
    );
    await queryInterface.removeIndex(
      'mood_entries',
      'idx_mood_entries_user_created_at',
    );
  },
};
