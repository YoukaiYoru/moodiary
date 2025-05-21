const { Op, fn, col, literal, where } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

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

  async getAverageMoodToday(userId, clientDateISO, timezone = 'UTC') {
    const baseDate = clientDateISO
      ? dayjs.tz(clientDateISO, timezone)
      : dayjs().tz(timezone);

    const startOfDay = baseDate.startOf('day').utc().toDate();
    const endOfDay = baseDate.endOf('day').utc().toDate();

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
      return { average: 0, emoji: '😐', name: 'No hay emociones' };
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
  async getAverageMoodByMonth(userId, year, month, timezone = 'UTC') {
    // month: 1 = enero, 12 = diciembre
    const results = [];

    // Crear dayjs para el primer día del mes a la zona horaria
    const firstDay = dayjs
      .tz(`${year}-${String(month).padStart(2, '0')}-01`, timezone)
      .startOf('day');
    const daysInMonth = firstDay.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const date = firstDay.add(i, 'day');
      const startOfDayUTC = date.startOf('day').utc().toDate();
      const endOfDayUTC = date.endOf('day').utc().toDate();

      const entries = await models.MoodEntry.findAll({
        where: {
          user_id: userId,
          created_at: { [Op.between]: [startOfDayUTC, endOfDayUTC] },
        },
        include: {
          model: models.MoodType,
          as: 'moodType',
          attributes: ['mood_score'],
        },
      });

      if (entries.length === 0) continue;

      const sum = entries.reduce((acc, e) => acc + e.moodType.mood_score, 0);
      const average = parseFloat((sum / entries.length).toFixed(2));

      results.push({
        date: date.format('YYYY-MM-DD'),
        average,
        emoji: getEmojiFromAverage(average),
        name: getNameFromAverage(average),
      });
    }

    return results;
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

  async findByDateFormatted(userId, isoDate, timeZone = 'UTC') {
    // Ejemplo: isoDate = '2025-05-20', timeZone = 'America/Lima'

    // Interpretar la fecha como medianoche en la zona del usuario
    const localMidnight = dayjs.tz(`${isoDate}T00:00:00`, timeZone);

    // Calcular el inicio y fin del día en UTC
    const utcStart = localMidnight.utc().toDate();
    const utcEnd = localMidnight.add(1, 'day').utc().toDate();

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
      timestamp: e.created_at.toISOString(),
      emotion: e.moodType?.emoji || '',
      text: e.note,
    }));
  }

  async getChartData(userId, range = '1d', clientDateISO, timezone = 'UTC') {
    const rangeMap = { '1d': 1, '7d': 7, '30d': 30 };
    const days = rangeMap[range] || 7;

    const baseDate = clientDateISO
      ? dayjs.tz(clientDateISO, timezone)
      : dayjs().tz(timezone);

    let startDate;
    let endDate;

    if (range === '1d') {
      startDate = baseDate.startOf('day');
      endDate = baseDate.endOf('day');
    } else {
      startDate = baseDate.subtract(days - 1, 'day').startOf('day');
      endDate = baseDate.endOf('day');
    }

    const startUTC = startDate.utc().toDate();
    const endUTC = endDate.utc().toDate();

    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.between]: [startUTC, endUTC],
        },
      },
      include: ['moodType'],
    });

    if (range === '1d') {
      // Devuelve cada entrada individual con timestamp exacto (fecha+hora+minutos)
      return entries
        .map((entry) => {
          const createdAtLocal = dayjs(entry.created_at).tz(timezone);
          return {
            date: createdAtLocal.format('YYYY-MM-DDTHH:mm:ss:SSS'),
            [entry.moodType.name]: entry.moodType.mood_score,
          };
        })
        .sort((a, b) => dayjs(a.date).toDate() - dayjs(b.date).toDate());
    } else {
      // Para 7d y 30d agrupar por día sumando scores por emoción
      const grouped = {};

      for (const entry of entries) {
        const createdAtLocal = dayjs(entry.created_at).tz(timezone);
        const key = createdAtLocal.format('YYYY-MM-DD');

        const mood = entry.moodType.name;
        const score = entry.moodType.mood_score;

        if (!grouped[key]) grouped[key] = {};
        grouped[key][mood] = (grouped[key][mood] || 0) + score;
      }

      return Object.entries(grouped)
        .sort(([a], [b]) => dayjs(a).toDate() - dayjs(b).toDate())
        .map(([date, moods]) => ({ date, ...moods }));
    }
  }
}

module.exports = MoodEntryService;
