const express = require('express');
const MoodEntryService = require('../services/moodEntry.service');
const { redirectIfUnauthenticated } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new MoodEntryService();

// Rutas para manejar moods/emociones
router.get('/', (req, res) => {
  res.send('List of moods');
});

router.get('/1', redirectIfUnauthenticated, (req, res) => {
  res.send('Details of mood 1');
});

// GET /entries/:userId → Obtener todas las entradas de un usuario
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const entries = await service.find({ user_id: userId });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// GET /entries/:userId/:entryId → Obtener una entrada específica
router.get('/:userId/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const entry = await service.findOne(entryId);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// GET /entries/:userId/stats → Obtener resumen estadístico de emociones
router.get('/:userId/stats', async (req, res, next) => {
  try {
    // Logic for generating emotion statistics for a user
    res.status(501).send('Not implemented');
  } catch (error) {
    next(error);
  }
});

// GET /entries/:userId/latest → Última entrada del usuario
router.get('/:userId/latest', async (req, res, next) => {
  try {
    // Logic for fetching the latest entry for a user
    res.status(501).send('Not implemented');
  } catch (error) {
    next(error);
  }
});

// POST /entries/:userId → Crear entrada (día, estado, nota)
router.post('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = { ...req.body, user_id: userId };
    const newEntry = await service.create(data);
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

// PUT /entries/:userId/:entryId → Editar entrada (nota o estado emocional)
router.put('/:userId/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const data = req.body;
    const updatedEntry = await service.update(entryId, data);
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// DELETE /entries/:userId/:entryId → Eliminar entrada
router.delete('/:userId/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const result = await service.delete(entryId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
