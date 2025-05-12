const express = require('express');
const MoodEntryTagService = require('../services/moodEntryTag.service');

const router = express.Router();
const service = new MoodEntryTagService();

// Route to list all mood entry tags
router.get('/', async (req, res, next) => {
  try {
    const moodEntryTags = await service.find();
    res.json(moodEntryTags);
  } catch (error) {
    next(error);
  }
});

// Route to create a new mood entry tag
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newMoodEntryTag = await service.create(data);
    res.status(201).json(newMoodEntryTag);
  } catch (error) {
    next(error);
  }
});

// Route to edit a mood entry tag
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedMoodEntryTag = await service.update(id, data);
    res.json(updatedMoodEntryTag);
  } catch (error) {
    next(error);
  }
});

// Route to delete a mood entry tag
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
