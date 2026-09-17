const express = require('express');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');
const ProfileService = require('../services/userProfile.service');

const router = express.Router();
const service = new ProfileService();

// GET /api/profile - Obtener el perfil del usuario actual
router.get('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const profile = await service.findByUserId(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/mood', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const profile = await service.findByUserId(userId);
    res.json({ mood: profile.preferred_mood });
  } catch (error) {
    next(error);
  }
});

// POST /api/profile - Crear perfil si no existe (opcional, útil al registrarse)
router.post('/', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const profile = await service.createIfNotExists(userId);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/profile - Actualizar campos del perfil (ej. mood, notas)
router.patch('/', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const allowed = ['display_name', 'preferred_mood'];
    const changes = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key)),
    );
    const updatedProfile = await service.update(userId, changes);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/profile - Eliminar perfil (si decides permitirlo)
router.delete('/', async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const result = await service.delete(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
