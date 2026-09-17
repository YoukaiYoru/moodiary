const express = require('express');
const MotivationalQuoteService = require('../services/motivationalQuote.service');
const MoodEntryService = require('../services/moodEntry.service');

const router = express.Router();
const service = new MotivationalQuoteService();
const moodEntryService = new MoodEntryService();
const { requireLocalAuth } = require('../middlewares/local-auth.handler');
const { requireAdmin } = require('../middlewares/security.handler');

// Route to list all motivational quotes
router.get('/', async (req, res, next) => {
  try {
    const quotes = await service.find();
    res.json(quotes);
  } catch (error) {
    next(error);
  }
});

router.get('/today', requireLocalAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const timezone = req.query.timezone || 'UTC';
    const result = await service.getMotivationalQuoteForToday(
      userId,
      moodEntryService,
      timezone,
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Server error retrieving motivational quote.' });
  }
});

// Route to create a new motivational quote
router.post('/', requireLocalAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = req.body;
    const newQuote = await service.create(data);
    res.status(201).json(newQuote);
  } catch (error) {
    next(error);
  }
});

// Route to edit a motivational quote
router.put('/:id', requireLocalAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedQuote = await service.update(id, data);
    res.json(updatedQuote);
  } catch (error) {
    next(error);
  }
});

// Route to delete a motivational quote
router.delete('/:id', requireLocalAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await service.delete(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
