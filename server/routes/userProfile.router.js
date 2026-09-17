const express = require('express');
const { requireAuth, getAuth } = require('@clerk/express');
const ProfileService = require('../services/userProfile.service');

const router = express.Router();
const service = new ProfileService();

// GET /api/profile - Obtener el perfil del usuario actual
router.get('/', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const profile = await service.findByClerkId(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/mood', requireAuth(), async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const profile = await service.findByClerkId(userId);
    res.json({ mood: profile.preferred_mood });
  } catch (error) {
    next(error);
  }
});

// POST /api/profile - Crear perfil si no existe (opcional, útil al registrarse)
router.post('/', async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const profile = await service.createIfNotExists(userId);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/profile - Actualizar campos del perfil (ej. mood, notas)
router.patch('/', async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
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
    const { userId } = getAuth(req);
    const result = await service.delete(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
