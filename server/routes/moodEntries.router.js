const express = require('express');
const MoodEntryService = require('../services/moodEntry.service');
const MoodTypeService = require('../services/moodType.service');
const {
  createMoodEntrySchema,
  getMoodEntrySchema,
  getOneMoodEntrySchema,
} = require('../schema/moodEntry.schema');
const validatorHandler = require('../middlewares/validator.handler');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');

const router = express.Router();

// Services
const service = new MoodEntryService();
const moodTypeService = new MoodTypeService();

// ✅ Obtener una entrada específica por ID (autenticado)
router.get('/entry/:entryId', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { entryId } = req.params;
    const entry = await service.findOneByUserId(userId, parseInt(entryId));
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// ✅ Obtener promedio de hoy (autenticado)
router.get('/average/today', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { date, timezone = 'UTC' } = req.query;
    const { average, emoji, name, count } = await service.getAverageMoodToday(
      userId,
      date,
      timezone,
    );
    res.json({ average, emoji, name, count });
  } catch (error) {
    next(error);
  }
});

router.get('/average/by-date', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { timezone, year, month } = req.query; // timezone obligatorio, year y month opcionales

    if (!timezone) {
      return res.status(400).json({ error: 'timezone is required' });
    }

    let averages;

    if (year && month) {
      // Si recibo año y mes, uso función para mes específico
      averages = await service.getAverageMoodByMonth(
        userId,
        parseInt(year, 10),
        parseInt(month, 10),
        timezone,
      );
    } else {
      // Si no, uso función para todas las fechas (o último rango, según implementación)
      averages = await service.getAverageMoodGroupedByDateLocal(
        userId,
        timezone,
      );
    }

    res.json(averages);
  } catch (error) {
    next(error);
  }
});

// ✅ Crear nueva entrada (autenticado)
router.post(
  '/',
  requireLocalAuth,
  validatorHandler(createMoodEntrySchema),
  async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const moodType = await moodTypeService.findByName(req.body.mood);
      if (!moodType) {
        return res
          .status(400)
          .json({ error: 'Tipo de estado de ánimo no válido' });
      }
      const data = {
        mood_type_id: moodType.id,
        user_id: userId,
        created_at: req.body.date,
        note: req.body.note,
      };
      const newEntry = await service.create(data);
      res.status(201).json(newEntry);
    } catch (error) {
      next(error);
    }
  },
);

// ✅ Obtener todas las entradas de un usuario
router.get(
  '/all',
  validatorHandler(getMoodEntrySchema),
  requireLocalAuth,
  async (req, res, next) => {
    try {
      const userId = req.auth.userId;
      const entries = await service.find({ user_id: userId });
      res.json(entries);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/dates', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const dates = await service.findDistinctDates(userId, req.query.timezone);
    res.json(dates);
  } catch (error) {
    next(error);
  }
});

// ✅ Obtener resumen estadístico (mock)
router.get('/chart', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { range = '1d', date, timezone = 'UTC' } = req.query;

    // Llamar servicio con params, timezone por defecto 'UTC'
    const data = await service.getChartData(userId, range, date, timezone);

    res.json(data);
  } catch (error) {
    next(error);
  }
});
// ✅ Obtener entradas por fecha
router.get('/entries/:isoDate', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { isoDate } = req.params;
    const timeZone = req.query.timeZone;

    if (!timeZone) {
      return res
        .status(400)
        .json({ error: 'Missing timeZone parameter (e.g., America/Lima)' });
    }

    const entries = await service.findByDateFormatted(
      userId,
      isoDate,
      timeZone,
    );

    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:entryId',
  requireLocalAuth,
  validatorHandler(createMoodEntrySchema),
  async (req, res, next) => {
    try {
      const { entryId } = req.params;
      const userId = req.auth.userId;
      const updatedEntry = await service.updateByUserId(
        userId,
        parseInt(entryId, 10),
        req.body,
      );
      res.json(updatedEntry);
    } catch (error) {
      next(error);
    }
  },
);

// Eliminar entrada específica
router.delete('/:entryId', requireLocalAuth, async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const userId = req.auth.userId;
    const result = await service.deleteByUserId(userId, parseInt(entryId, 10));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
