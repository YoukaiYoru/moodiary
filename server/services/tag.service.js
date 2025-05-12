const { models } = require('../libs/sequelize');
const Boom = require('@hapi/boom');

class TagService {
  async find() {
    return await models.Tag.findAll();
  }

  async findOne(id) {
    const tag = await models.Tag.findByPk(id);
    if (!tag) {
      throw Boom.notFound('Tag not found');
    }
    return tag;
  }

  async create(data) {
    return await models.Tag.create(data);
  }

  async update(id, changes) {
    const tag = await this.findOne(id);
    return await tag.update(changes);
  }

  async delete(id) {
    const tag = await this.findOne(id);
    await tag.destroy();
    return { id };
  }
}

module.exports = TagService;
