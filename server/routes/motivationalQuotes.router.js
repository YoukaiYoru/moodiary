const express = require('express');
const MotivationalQuoteService = require('../services/motivationalQuote.service');
const MoodEntryService = require('../services/moodEntry.service');

const router = express.Router();
const service = new MotivationalQuoteService();
const moodEntryService = new MoodEntryService();
const { requireAuth, getAuth } = require('@clerk/express');

// Route to list all motivational quotes
router.get('/', async (req, res, next) => {
  try {
    const quotes = await service.find();
    res.json(quotes);
  } catch (error) {
    next(error);
  }
});

router.get('/today', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const result = await service.getMotivationalQuoteForToday(
      userId,
      moodEntryService,
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
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newQuote = await service.create(data);
    res.status(201).json(newQuote);
  } catch (error) {
    next(error);
  }
});

// Route to edit a motivational quote
router.put('/:id', async (req, res, next) => {
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
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await service.delete(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
