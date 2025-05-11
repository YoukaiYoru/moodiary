const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');

// Rutas para manejar moods/emociones
router.get('/', (req, res) => {
  res.send('List of moods');
});

router.get('/1', requireAuth(), (req, res) => {
  res.send('Details of mood 1');
});

module.exports = router;
