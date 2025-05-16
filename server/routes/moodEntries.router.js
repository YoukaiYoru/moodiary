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
    const averageMood = await service.getAverageMoodToday(userId);
    res.json({ averageMood });
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
  '/user/:userId',
  validatorHandler(getMoodEntrySchema),
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const entries = await service.find({ user_id: userId });
      res.json(entries);
    } catch (error) {
      next(error);
    }
  },
);

// ✅ Obtener resumen estadístico (mock)
router.get('/user/:userId/stats', async (req, res, next) => {
  try {
    res.status(501).send('Not implemented');
  } catch (error) {
    next(error);
  }
});

// ✅ Obtener última entrada (mock)
router.get('/user/:userId/latest', async (req, res, next) => {
  try {
    res.status(501).send('Not implemented');
  } catch (error) {
    next(error);
  }
});

// ✅ Editar entrada
router.put('/user/:userId/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const updatedEntry = await service.update(parseInt(entryId), req.body);
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// ✅ Eliminar entrada
router.delete('/user/:userId/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const result = await service.delete(parseInt(entryId));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
