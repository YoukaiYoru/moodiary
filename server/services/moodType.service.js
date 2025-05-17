const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');

class MoodTypeService {
  async find() {
    return await models.MoodType.findAll();
  }

  async findOne(id) {
    const moodType = await models.MoodType.findByPk(id);
    if (!moodType) {
      throw boom.notFound('MoodType not found');
    }
    return moodType;
  }
  async findByName(name) {
    const moodType = await models.MoodType.findOne({
      where: {
        name,
      },
    });
    if (!moodType) {
      throw boom.notFound('MoodType not found');
    }
    return moodType;
  }

  async create(data) {
    return await models.MoodType.create(data);
  }

  async update(id, changes) {
    const moodType = await this.findOne(id);
    if (!moodType) {
      throw boom.notFound('MoodType not found');
    }
    return await moodType.update(changes);
  }

  async delete(id) {
    const moodType = await this.findOne(id);
    if (!moodType) {
      throw boom.notFound('MoodType not found');
    }
    await moodType.destroy();
    return { id };
  }
}

module.exports = MoodTypeService;
