const express = require('express');
const router = express.Router();

// Rutas para manejar moods/emociones
router.get('/', (req, res) => {
   res.send('List of moods');
});

module.exports = router;
