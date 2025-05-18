const { Op, fn, col, literal, where } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance

const moodScoreToEmoji = {
  1: '😢', // Tristeza
  2: '😠', // Enojo
  3: '😰', // Ansiedad
  4: '😌', // Calma
  5: '😄', // Alegría
};

function getEmojiFromAverage(score) {
  if (score >= 1 && score < 2) return moodScoreToEmoji[1];
  if (score >= 2 && score < 3) return moodScoreToEmoji[2];
  if (score >= 3 && score < 4) return moodScoreToEmoji[3];
  if (score >= 4 && score < 5) return moodScoreToEmoji[4];
  if (score === 5) return moodScoreToEmoji[5];
  return '❓';
}

class MoodEntryService {
  async create(data) {
    try {
      const moodEntry = await models.MoodEntry.create(data);
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error creating mood entry', error);
    }
  }

  async findOne(id) {
    try {
      const moodEntry = await models.MoodEntry.findByPk(id);
      if (!moodEntry) {
        throw Boom.notFound('Mood entry not found');
      }
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error fetching mood entry', error);
    }
  }
  async findOneByUserId(userId, id) {
    const moodEntry = await models.MoodEntry.findOne({
      where: {
        user_id: userId,
        id,
      },
    });

    if (!moodEntry) {
      throw Boom.notFound('Mood entry not found');
    }

    return moodEntry;
  }

  async findByMood(mood) {
    try {
      const moodEntries = await models.MoodEntry.findOne({
        include: {
          model: models.MoodType,
          as: 'moodType',
          where: {
            name: {
              [Op.eq]: mood,
            },
          },
        },
      });
      return moodEntries;
    } catch (error) {
      throw Boom.badImplementation('Error fetching mood entries', error);
    }
  }

  async find(filters = {}) {
    try {
      const moodEntries = await models.MoodEntry.findAll({
        where: filters,
      });
      return moodEntries;
    } catch (error) {
      throw Boom.badImplementation('Error fetching mood entries', error);
    }
  }

  async update(id, data) {
    try {
      const moodEntry = await this.findOne(id);
      await moodEntry.update(data);
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error updating mood entry', error);
    }
  }

  async delete(id) {
    try {
      const moodEntry = await this.findOne(id);
      await moodEntry.destroy();
      return { message: 'Mood entry deleted successfully' };
    } catch (error) {
      throw Boom.badImplementation('Error deleting mood entry', error);
    }
  }
  //Custom services

  async getAverageMoodToday(userId, clientDateUTC) {
    const baseDate = clientDateUTC ? new Date(clientDateUTC) : new Date();
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: {
        model: models.MoodType,
        as: 'moodType',
        attributes: ['mood_score', 'name'],
      },
    });

    if (entries.length === 0) {
      return { average: 0, emoji: '😐', name: 'No hay emociones' }; // emoji neutro, por ejemplo
    }

    const sum = entries.reduce(
      (total, entry) => total + entry.moodType.mood_score,
      0,
    );
    const average = sum / entries.length;

    return {
      average: parseFloat(average.toFixed(2)),
      emoji: getEmojiFromAverage(average),
      name: entries[0].moodType.name,
    };
  }

  async findDistinctDates(userId) {
    const results = await models.MoodEntry.findAll({
      attributes: [[fn('DATE', col('created_at')), 'date']],
      where: { user_id: userId },
      group: [literal('DATE(created_at)')],
      order: [literal('DATE(created_at) DESC')],
      raw: true,
    });

    return results; // [{ date: '2025-05-16' }, ...]
  }
  async findByDateFormatted(userId, isoDate) {
    const dateOnly = isoDate.split('T')[0];

    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        [Op.and]: [where(fn('DATE', col('created_at')), dateOnly)],
      },
      include: ['moodType'],
      order: [['created_at', 'ASC']],
    });

    return entries.map((e) => ({
      hour: e.created_at.toTimeString().slice(0, 5), // HH:MM
      emotion: e.moodType?.emoji || '', // opcional, por si no hay asociación
      text: e.note,
    }));
  }

  async getChartData(userId, range = '1d') {
    const rangeMap = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
    };
    const days = rangeMap[range] || 7;

    const results = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: literal(`CURRENT_DATE - INTERVAL '${days} day'`),
        },
      },
      include: ['moodType'], // si definiste asociación
    });

    const grouped = {};

    for (const entry of results) {
      const date = entry.created_at.toISOString().split('T')[0];
      const mood = entry.moodType.name;

      if (!grouped[date]) grouped[date] = {};
      grouped[date][mood] = (grouped[date][mood] || 0) + 1;
    }

    return Object.entries(grouped).map(([date, moods]) => ({
      date,
      ...moods,
    }));
  }
}

module.exports = MoodEntryService;
