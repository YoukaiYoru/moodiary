const express = require('express');
const UserDailyQuoteService = require('../services/userDailyQuote.service');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');

const router = express.Router();
const service = new UserDailyQuoteService();

// Route to list all user daily quotes
  router.get('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const dailyQuotes = await service.find({ user_id: userId });
    res.json(dailyQuotes);
  } catch (error) {
    next(error);
  }
});

// Route to create a new user daily quote
  router.post('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const data = { ...req.body, user_id: userId };
    const newDailyQuote = await service.create(data);
    res.status(201).json(newDailyQuote);
  } catch (error) {
    next(error);
  }
});

// Route to edit a user daily quote
  router.put('/:id', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const data = req.body;
    const updatedDailyQuote = await service.update(id, data, userId);
    res.json(updatedDailyQuote);
  } catch (error) {
    next(error);
  }
});

// Route to delete a user daily quote
  router.delete('/:id', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const result = await service.delete(id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
