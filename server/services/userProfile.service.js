const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { models } = sequelize;
const { verifyPassword } = require('./auth.service');

function publicProfile(profile) {
  const data = profile.toJSON();
  delete data.password_hash;
  return data;
}

class UserProfileService {
  async findByUserId(userId) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    return publicProfile(profile);
  }

  // Crear un perfil si no existe
  async createIfNotExists(userId) {
    let profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = await models.UserProfile.create({ user_id: userId });
    }

    return publicProfile(profile);
  }

  // Actualizar el perfil con campos de negocio (notas, mood, etc.)
  async update(userId, changes) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.update(changes);
    return publicProfile(profile);
  }

  async updateDayMood(userId, mood) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.update({ preferred_mood: mood });
    return publicProfile(profile);
  }

  async deleteData(userId, currentPassword) {
    const profile = await models.UserProfile.findByPk(userId);
    if (!profile || !(await verifyPassword(currentPassword, profile.password_hash))) {
      throw boom.unauthorized('La contraseña actual no es correcta.');
    }
    const result = await sequelize.transaction(async (transaction) => {
      const [moods, quotes] = await Promise.all([
        models.MoodEntry.destroy({ where: { user_id: userId }, transaction }),
        models.UserDailyQuote.destroy({ where: { user_id: userId }, transaction }),
      ]);
      return { moods, quotes };
    });
    return { moodEntriesDeleted: result.moods, dailyQuotesDeleted: result.quotes };
  }

  async delete(userId, currentPassword) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) throw boom.notFound('Perfil no encontrado');
    if (!(await verifyPassword(currentPassword, profile.password_hash))) {
      throw boom.unauthorized('La contraseña actual no es correcta.');
    }

    await profile.destroy();
    return { message: 'Cuenta eliminada' };
  }
}

module.exports = UserProfileService;
