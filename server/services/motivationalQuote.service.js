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
    if (isNaN(averageMood)) {
      return {
        mood_score: null,
        message: 'Unable to calculate mood average.',
      };
    }
    const roundedMood = Math.round(averageMood || 3);
    // default neutro si es 0
    console.log('averageMood', averageMood, 'roundedMood', roundedMood);

    const randomFrase = await models.MotivationalQuote.findOne({
      where: { mood_score_target: roundedMood },
      order: sequelize.random(),
    });

    if (!randomFrase) {
      return {
        mood_score: roundedMood,
        message: 'No motivational quote found for this mood.',
      };
    }

    return {
      mood_score: roundedMood,
      message: randomFrase.message,
    };
  }
}

module.exports = MotivationalQuoteService;
