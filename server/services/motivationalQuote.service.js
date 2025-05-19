const sequelize = require('../libs/sequelize');
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
    const quote = await models.MotivationalQuote.findOne(id);
    return await quote.update(changes);
  }

  async delete(id) {
    const quote = await models.MotivationalQuote.findOne(id);
    await quote.destroy();
    return { id };
  }
  async getMotivationalQuoteForToday(userId, moodService) {
    const { average: averageMood } =
      await moodService.getAverageMoodToday(userId);

    if (typeof averageMood !== 'number' || isNaN(averageMood)) {
      return {
        mood_score: null,
        message: 'No se pudo calcular tu estado de ánimo hoy.',
      };
    }

    const roundedMood = Math.floor(averageMood);

    const randomFrase = await models.MotivationalQuote.findOne({
      where: { mood_score_target: roundedMood },
      order: sequelize.random(), // Sequelize literal para aleatoriedad
    });

    if (!randomFrase) {
      return {
        mood_score: roundedMood,
        message: 'No hay frases motivacionales aún para este estado de ánimo.',
      };
    }

    return {
      mood_score: roundedMood,
      message: randomFrase.message,
    };
  }
}

module.exports = MotivationalQuoteService;
