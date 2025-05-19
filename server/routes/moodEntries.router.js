const express = require('express');
const MoodEntryService = require('../services/moodEntry.service');
const MoodTypeService = require('../services/moodType.service');
const {
  createMoodEntrySchema,
  getMoodEntrySchema,
  getOneMoodEntrySchema,
} = require('../schema/moodEntry.schema');
const validatorHandler = require('../middlewares/validator.handler');
const { requireAuth, getAuth } = require('@clerk/express');

const router = express.Router();

// Services
const service = new MoodEntryService();
const moodTypeService = new MoodTypeService();

// ✅ Obtener una entrada específica por ID (autenticado)
router.get('/entry/:entryId', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { entryId } = req.params;
    const entry = await service.findOneByUserId(userId, parseInt(entryId));
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// ✅ Obtener promedio de hoy (autenticado)
router.get('/average/today', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { date, timezone = 'UTC' } = req.query;
    const { average, emoji, name } = await service.getAverageMoodToday(
      userId,
      date,
      timezone,
    );
    res.json({ average, emoji, name });
  } catch (error) {
    next(error);
  }
});

router.get('/average/by-date', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { timezone } = req.query; // Ej: "America/Lima"

    if (!timezone) {
      return res.status(400).json({ error: 'timezone is required' });
    }

    const averages = await service.getAverageMoodGroupedByDateLocal(
      userId,
      timezone,
    );

    res.json(averages);
  } catch (error) {
    next(error);
  }
});

// ✅ Crear nueva entrada (autenticado)
router.post(
  '/',
  requireAuth(),
  validatorHandler(createMoodEntrySchema),
  async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
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
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      const entries = await service.find({ user_id: userId });
      res.json(entries);
    } catch (error) {
      next(error);
    }
  },
);

router.get('/dates', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const dates = await service.findDistinctDates(userId);
    res.json(dates);
  } catch (error) {
    next(error);
  }
});

// ✅ Obtener resumen estadístico (mock)
router.get('/chart', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { range = '1d', date, timezone = 'UTC' } = req.query;

    // Llamar servicio con params, timezone por defecto 'UTC'
    const data = await service.getChartData(userId, range, date, timezone);

    res.json(data);
  } catch (error) {
    next(error);
  }
});
// ✅ Obtener entradas por fecha
router.get('/entries/:isoDate', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { isoDate } = req.params;
    // offset en minutos (por ejemplo, -300 para UTC-5)
    const offsetMinutes = parseInt(req.query.offset, 10) || 0;

    const entries = await service.findByDateFormatted(
      userId,
      isoDate,
      offsetMinutes,
    );
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.put('/:entryId', requireAuth(), async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const updatedEntry = await service.update(parseInt(entryId), req.body);
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// Eliminar entrada específica
router.delete('/:entryId', requireAuth(), async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const result = await service.delete(parseInt(entryId));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
