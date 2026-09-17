const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');

class UserDailyQuoteService {
  async find(filters = {}) {
    const quotes = await models.UserDailyQuote.findAll({ where: filters });
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

  async update(id, changes, userId) {
    const quote = await models.UserDailyQuote.findOne({ where: { id, user_id: userId } });
    if (!quote) throw boom.notFound('Quote not found');
    const updatedQuote = await quote.update(changes);
    return updatedQuote;
  }

  async delete(id, userId) {
    const quote = await models.UserDailyQuote.findOne({ where: { id, user_id: userId } });
    if (!quote) throw boom.notFound('Quote not found');
    await quote.destroy();
    return { id };
  }
}

module.exports = UserDailyQuoteService;
