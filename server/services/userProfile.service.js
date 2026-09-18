const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
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

  async updateAccount(userId, changes, currentPassword) {
    const profile = await models.UserProfile.findByPk(userId);
    if (!profile) throw boom.notFound('Perfil no encontrado');
    if (!(await verifyPassword(currentPassword, profile.password_hash))) {
      throw boom.unauthorized('La contraseña actual no es correcta.');
    }
    if (changes.email && changes.email !== profile.email) {
      const existing = await models.UserProfile.findOne({ where: { email: changes.email } });
      if (existing) throw boom.conflict('Ya existe una cuenta con ese correo.');
    }
    await profile.update(changes);
    return publicProfile(profile);
  }

  async deleteData(userId, currentPassword) {
    const profile = await models.UserProfile.findByPk(userId);
    if (!profile || !(await verifyPassword(currentPassword, profile.password_hash))) {
      throw boom.unauthorized('La contraseña actual no es correcta.');
    }
    const [moods, quotes] = await Promise.all([
      models.MoodEntry.destroy({ where: { user_id: userId } }),
      models.UserDailyQuote.destroy({ where: { user_id: userId } }),
    ]);
    return { moodEntriesDeleted: moods, dailyQuotesDeleted: quotes };
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
