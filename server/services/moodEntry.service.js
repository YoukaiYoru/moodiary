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

const moodScoreToName = {
  1: 'Tristeza',
  2: 'Enojo',
  3: 'Ansiedad',
  4: 'Calma',
  5: 'Alegría',
};

function getEmojiFromAverage(score) {
  if (score >= 1 && score < 2) return moodScoreToEmoji[1];
  if (score >= 2 && score < 3) return moodScoreToEmoji[2];
  if (score >= 3 && score < 4) return moodScoreToEmoji[3];
  if (score >= 4 && score < 5) return moodScoreToEmoji[4];
  if (score === 5) return moodScoreToEmoji[5];
  return '❓';
}

function getNameFromAverage(score) {
  if (score >= 1 && score < 2) return moodScoreToName[1];
  if (score >= 2 && score < 3) return moodScoreToName[2];
  if (score >= 3 && score < 4) return moodScoreToName[3];
  if (score >= 4 && score < 5) return moodScoreToName[4];
  if (score === 5) return moodScoreToName[5];
  return 'Desconocido';
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
        attributes: ['mood_score'],
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
      name: getNameFromAverage(average),
    };
  }
  async getAverageMoodGroupedByDateLocal(userId, timezone) {
    const entries = await models.MoodEntry.findAll({
      where: { user_id: userId },
      attributes: [
        [
          literal(
            `DATE("created_at" AT TIME ZONE 'UTC' AT TIME ZONE '${timezone}')`,
          ),
          'date',
        ],
        [fn('AVG', col('moodType.mood_score')), 'average'],
      ],
      include: [
        {
          model: models.MoodType,
          as: 'moodType',
          attributes: [],
        },
      ],
      group: [
        literal(
          `DATE("created_at" AT TIME ZONE 'UTC' AT TIME ZONE '${timezone}')`,
        ),
      ],
      order: [
        literal(
          `DATE("created_at" AT TIME ZONE 'UTC' AT TIME ZONE '${timezone}')`,
        ),
      ],
      raw: true,
    });

    return entries.map((e) => {
      const avg = parseFloat(parseFloat(e.average).toFixed(2));
      return {
        date: e.date,
        average: avg,
        emoji: getEmojiFromAverage(avg),
        name: getNameFromAverage(avg),
      };
    });
  }

  async findDistinctDates(userId) {
    const results = await models.MoodEntry.findAll({
      attributes: ['created_at'],
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      raw: true,
    });

    return results; // [{ date: '2025-05-16' }, ...]
  }

  // Devuelve las entradas de estado de ánimo para una fecha específica
  // en formato ISO UTC (ejemplo: '2025-05-16T00:00:00Z')
  async findByDateFormatted(userId, isoDate) {
    const localMidnight = new Date(`${isoDate}T00:00:00`);
    const utcStart = new Date(
      localMidnight.getTime() - localMidnight.getTimezoneOffset() * 60000,
    );
    const utcEnd = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1); // fin del día

    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.between]: [utcStart, utcEnd],
        },
      },
      include: ['moodType'],
      order: [['created_at', 'ASC']],
    });

    return entries.map((e) => ({
      timestamp: e.created_at.toISOString(), // sigue en UTC
      emotion: e.moodType?.emoji || '',
      text: e.note,
    }));
  }

  async getChartData(userId, range = '1d', clientDateISO, timezone = 'UTC') {
    const rangeMap = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
    };
    const days = rangeMap[range] || 7;

    const baseDate = clientDateISO ? new Date(clientDateISO) : new Date();

    // Ajuste de fechas UTC para la consulta
    const endDateUTC = new Date(baseDate);
    endDateUTC.setUTCHours(23, 59, 59, 999);
    const startDateUTC = new Date(endDateUTC);
    startDateUTC.setUTCDate(endDateUTC.getUTCDate() - (days - 1));
    startDateUTC.setUTCHours(0, 0, 0, 0);

    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.between]: [startDateUTC, endDateUTC],
        },
      },
      include: ['moodType'],
    });

    const grouped = {};

    for (const entry of entries) {
      const createdAt = new Date(
        entry.created_at.toLocaleString('en-US', { timeZone: timezone }),
      );

      let key;
      if (range === '1d') {
        // Agrupar por hora local
        const hour = createdAt.getHours().toString().padStart(2, '0');
        key = `${createdAt.toISOString().split('T')[0]}T${hour}:00`;
      } else {
        // Agrupar por día local
        key = createdAt.toLocaleDateString('en-CA', { timeZone: timezone });
      }

      const mood = entry.moodType.name;
      const score = entry.moodType.mood_score;

      if (!grouped[key]) grouped[key] = {};
      grouped[key][mood] = (grouped[key][mood] || 0) + score;
    }

    return Object.entries(grouped).map(([date, moods]) => ({
      date,
      ...moods,
    }));
  }
}

module.exports = MoodEntryService;
