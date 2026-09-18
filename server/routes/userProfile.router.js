const express = require('express');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');
const ProfileService = require('../services/userProfile.service');
const { changePassword } = require('../services/auth.service');
const { serializeSessionCookie } = require('../lib/session-cookie');

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
router.post('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const profile = await service.createIfNotExists(userId);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/profile - Actualizar campos del perfil (ej. mood, notas)
router.patch('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const allowed = ['display_name', 'preferred_mood', 'avatar_url'];
    const changes = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key)),
    );
    if (typeof changes.display_name === 'string') {
      changes.display_name = changes.display_name.trim().slice(0, 80);
    }
    if (changes.avatar_url !== null && typeof changes.avatar_url !== 'string') {
      return res.status(400).json({ message: 'La imagen de perfil no es válida.' });
    }
    if (typeof changes.avatar_url === 'string') {
      const validImage = /^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(changes.avatar_url);
      if (!validImage || changes.avatar_url.length > 1_400_000) {
        return res.status(400).json({ message: 'La imagen debe ser JPG, PNG o WebP y pesar menos de 1 MB.' });
      }
    }
    const updatedProfile = await service.update(userId, changes);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
});

router.patch('/password', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const session = await changePassword(userId, req.body?.currentPassword, req.body?.newPassword);
    const { rawToken, maxAge } = session;
    res.setHeader('Set-Cookie', serializeSessionCookie(rawToken, maxAge));
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    next(error);
  }
});

router.delete('/data', requireLocalAuth, async (req, res, next) => {
  try {
    res.json(await service.deleteData(req.auth.userId, req.body?.currentPassword));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/profile - Eliminar perfil (si decides permitirlo)
router.delete('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const result = await service.delete(userId, req.body?.currentPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
