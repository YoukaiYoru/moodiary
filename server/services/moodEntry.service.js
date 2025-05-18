const { Op, fn, col, literal, where } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance
const {
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
  format,
} = require('date-fns-tz');

const { startOfDay, endOfDay, subDays, formatISO } = require('date-fns');

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
  async findByDateFormatted(userId, isoDate, offsetMinutes = 0) {
    // isoDate: 'YYYY-MM-DD' en la zona horaria del usuario
    // offsetMinutes: diferencia con UTC en minutos (ejemplo: -300 para UTC-5)

    // Construimos la fecha local en la zona del usuario:
    const localMidnight = new Date(`${isoDate}T00:00:00`);

    // Calculamos el inicio y fin del día en UTC,
    // compensando la diferencia de zona horaria
    const utcStart = new Date(localMidnight.getTime() - offsetMinutes * 60000);
    const utcEnd = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1);

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
      timestamp: e.created_at.toISOString(), // UTC
      emotion: e.moodType?.emoji || '',
      text: e.note,
    }));
  }

  async getChartData(userId, range = '1d', clientDateISO, timezone = 'UTC') {
    const rangeMap = { '1d': 1, '7d': 7, '30d': 30 };
    const days = rangeMap[range] || 7;

    // Fecha base en UTC (o la que pase el cliente)
    const baseDateUTC = clientDateISO ? new Date(clientDateISO) : new Date();

    // Convertir a fecha local en la zona horaria del usuario
    const baseDateLocal = toZonedTime(baseDateUTC, timezone);

    // Obtener string fecha base local en formato yyyy-MM-dd (día completo)
    const baseDateStr = formatInTimeZone(baseDateLocal, timezone, 'yyyy-MM-dd');

    // Construir la fecha base local a medianoche (inicio del día) en la zona horaria
    const baseMidnightLocal = fromZonedTime(
      new Date(baseDateStr + 'T00:00:00'),
      timezone,
    );

    // Calcular fecha de inicio restando (days - 1) días a la fecha base local a medianoche
    // Como baseMidnightLocal es UTC equivalente a la zona horaria local, podemos restar ms directo
    const startUTC = new Date(
      baseMidnightLocal.getTime() - (days - 1) * 86400000,
    );

    // Fecha de fin será la fecha base local a las 23:59:59 en la zona horaria
    const endDateStr = baseDateStr + 'T23:59:59';
    const endUTC = fromZonedTime(new Date(endDateStr), timezone);

    // Consultar la base de datos con el rango entre startUTC y endUTC
    const entries = await models.MoodEntry.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.between]: [startUTC, endUTC],
        },
      },
      include: ['moodType'],
    });

    const grouped = {};

    for (const entry of entries) {
      // Convertir created_at UTC a fecha local en zona horaria
      const createdAtLocal = toZonedTime(entry.created_at, timezone);

      // Clave de agrupación: por hora para 1d, por día para 7d y 30d
      const key =
        range === '1d'
          ? formatInTimeZone(createdAtLocal, timezone, "yyyy-MM-dd'T'HH':00'")
          : formatInTimeZone(createdAtLocal, timezone, 'yyyy-MM-dd');

      const mood = entry.moodType.name;
      const score = entry.moodType.mood_score;

      if (!grouped[key]) grouped[key] = {};
      grouped[key][mood] = (grouped[key][mood] || 0) + score;
    }

    // Ordenar resultados
    const sortedEntries = Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, moods]) => ({ date, ...moods }));

    return sortedEntries;
  }
}

module.exports = MoodEntryService;
