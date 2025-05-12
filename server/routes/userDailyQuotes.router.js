const express = require('express');
const UserDailyQuoteService = require('../services/userDailyQuote.service');

const router = express.Router();
const service = new UserDailyQuoteService();

// Route to list all user daily quotes
router.get('/', async (req, res, next) => {
  try {
    const dailyQuotes = await service.find();
    res.json(dailyQuotes);
  } catch (error) {
    next(error);
  }
});

// Route to create a new user daily quote
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newDailyQuote = await service.create(data);
    res.status(201).json(newDailyQuote);
  } catch (error) {
    next(error);
  }
});

// Route to edit a user daily quote
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedDailyQuote = await service.update(id, data);
    res.json(updatedDailyQuote);
  } catch (error) {
    next(error);
  }
});

// Route to delete a user daily quote
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
