const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ProfileService {
  // Obtener perfil por user_id de Clerk
  async findByClerkId(userId) {
    const profile = await models.ProfileUser.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    return profile;
  }

  // Crear un perfil si no existe
  async createIfNotExists(userId) {
    let profile = await models.ProfileUser.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = await models.ProfileUser.create({ user_id: userId });
    }

    return profile;
  }

  // Actualizar el perfil con campos de negocio (notas, mood, etc.)
  async update(userId, changes) {
    const profile = await models.ProfileUser.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.update(changes);
    return profile;
  }

  // Eliminar perfil (si decides permitirlo)
  async delete(userId) {
    const profile = await models.ProfileUser.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw boom.notFound('Perfil no encontrado');
    }

    await profile.destroy();
    return { message: 'Perfil eliminado' };
  }
}

module.exports = ProfileService;
