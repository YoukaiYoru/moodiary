const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class UserProfileService {
  async findByUserId(userId) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    return profile;
  }

  // Crear un perfil si no existe
  async createIfNotExists(userId) {
    let profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = await models.UserProfile.create({ user_id: userId });
    }

    return profile;
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
    return profile;
  }

  async updateDayMood(userId, mood) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.update({ preferred_mood: mood });
    return profile;
  }

  // Eliminar perfil (si decides permitirlo)
  async delete(userId) {
    const profile = await models.UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.destroy();
    return { message: 'Perfil eliminado' };
  }
}

module.exports = UserProfileService;
