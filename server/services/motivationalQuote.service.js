const sequelize = require('../libs/sequelize');
const { models } = require('../libs/sequelize');
const Boom = require('@hapi/boom');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const GeminiService = require('./gemini.service');

dayjs.extend(utc);
dayjs.extend(timezone);

class MotivationalQuoteService {
  constructor() {
    this.geminiService = new GeminiService();
  }

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
  async getMotivationalQuoteForToday(userId, moodService, userTimezone = 'UTC') {
    let safeTimezone = 'UTC';
    try {
      Intl.DateTimeFormat('en-US', { timeZone: userTimezone }).format();
      safeTimezone = userTimezone;
    } catch {
      // Se mantiene UTC si el cliente envía una zona horaria inválida.
    }

    const quoteDate = dayjs().tz(safeTimezone).format('YYYY-MM-DD');
    const dailyQuote = await models.UserDailyQuote.findOne({
      where: { user_id: userId, quote_date: quoteDate },
      include: { model: models.MotivationalQuote, as: 'quote' },
    });

    // Las frases antiguas de IA no bloquean una nueva generación con Gemini.
    if (dailyQuote?.source === 'gemini' && dailyQuote.message) {
      return {
        mood_score: null,
        message: dailyQuote.message,
        source: 'gemini',
      };
    }

    const moodStats = await moodService.getAverageMoodToday(
      userId,
      undefined,
      safeTimezone,
    );
    const { average: averageMood } = moodStats;

    if (
      !moodStats.count ||
      typeof averageMood !== 'number' ||
      Number.isNaN(averageMood)
    ) {
      return {
        mood_score: null,
        message: 'Registra un estado de ánimo para recibir una frase personalizada.',
        source: 'fallback',
      };
    }

    let generatedMessage = null;
    try {
      generatedMessage = await this.geminiService.generateDailyQuote({
        average: moodStats.average,
        mood: moodStats.name,
        count: moodStats.count,
      });
    } catch (error) {
      console.warn(`Gemini no disponible: ${error.message}`);
    }

    if (generatedMessage) {
      await this.saveDailyQuote(userId, quoteDate, {
        message: generatedMessage,
        source: 'gemini',
      });

      return {
        mood_score: averageMood,
        message: generatedMessage,
        source: 'gemini',
      };
    }

    const roundedMood = Math.floor(averageMood);

    const randomFrase = await models.MotivationalQuote.findOne({
      where: { mood_score_target: roundedMood },
      order: sequelize.random(), // Sequelize literal para aleatoriedad
    });

    if (!randomFrase) {
      const fallback = {
        mood_score: roundedMood,
        message: 'No hay frases motivacionales aún para este estado de ánimo.',
        source: 'fallback',
      };
      await this.saveDailyQuote(userId, quoteDate, {
        message: fallback.message,
        source: fallback.source,
      });
      return fallback;
    }

    const fallback = {
      mood_score: roundedMood,
      message: randomFrase.message,
      source: 'database',
    };
    await this.saveDailyQuote(userId, quoteDate, {
      message: fallback.message,
      source: fallback.source,
      quote_id: randomFrase.id,
    });
    return fallback;
  }

  async saveDailyQuote(userId, quoteDate, data) {
    try {
      await models.UserDailyQuote.create({
        user_id: userId,
        quote_date: quoteDate,
        ...data,
      });
    } catch (error) {
      // Otra petición pudo crear la frase entre el findOne y el create.
      if (error.name !== 'SequelizeUniqueConstraintError') throw error;
    }
  }
}

module.exports = MotivationalQuoteService;
