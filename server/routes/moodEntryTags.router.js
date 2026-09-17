const express = require('express');
const MoodEntryTagService = require('../services/moodEntryTag.service');
const { requireLocalAuth } = require('../middlewares/local-auth.handler');

const router = express.Router();
const service = new MoodEntryTagService();

// Route to list all mood entry tags
  router.get('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const moodEntryTags = await service.findForUser(userId);
    res.json(moodEntryTags);
  } catch (error) {
    next(error);
  }
});

// Route to create a new mood entry tag
  router.post('/', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const data = req.body;
    const newMoodEntryTag = await service.create(data, userId);
    res.status(201).json(newMoodEntryTag);
  } catch (error) {
    next(error);
  }
});

// Route to edit a mood entry tag
  router.put('/:entryId/:tagId', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { entryId, tagId } = req.params;
    const data = req.body;
    const updatedMoodEntryTag = await service.update({ entryId, tagId }, data, userId);
    res.json(updatedMoodEntryTag);
  } catch (error) {
    next(error);
  }
});

// Route to delete a mood entry tag
  router.delete('/:entryId/:tagId', requireLocalAuth, async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { entryId, tagId } = req.params;
    const result = await service.delete({ entryId, tagId }, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
