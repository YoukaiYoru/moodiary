const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');

class UserDailyQuoteService {
  async find() {
    const quotes = await models.UserDailyQuote.findAll();
    return quotes;
  }

  async findOne(id) {
    const quote = await models.UserDailyQuote.findByPk(id);
    if (!quote) {
      throw boom.notFound('Quote not found');
    }
    return quote;
  }

  async create(data) {
    const newQuote = await models.UserDailyQuote.create(data);
    return newQuote;
  }

  async update(id, changes) {
    const quote = await this.findOne(id);
    const updatedQuote = await quote.update(changes);
    return updatedQuote;
  }

  async delete(id) {
    const quote = await this.findOne(id);
    await quote.destroy();
    return { id };
  }
}

module.exports = UserDailyQuoteService;
