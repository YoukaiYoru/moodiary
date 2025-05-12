const { models } = require('../libs/sequelize');
const Boom = require('@hapi/boom');

class MotivationalQuoteService {
  async find() {
    return await models.MotivationalQuote.findAll();
  }

  async findOne(id) {
    const quote = await models.MotivationalQuote.findByPk(id);
    if (!quote) {
      throw Boom.notFound('Quote not found');
    }
    return quote;
  }

  async create(data) {
    return await models.MotivationalQuote.create(data);
  }

  async update(id, changes) {
    const quote = await this.findOne(id);
    return await quote.update(changes);
  }

  async delete(id) {
    const quote = await this.findOne(id);
    await quote.destroy();
    return { id };
  }
}

module.exports = MotivationalQuoteService;
