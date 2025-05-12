const express = require('express');
const MoodTypeService = require('../services/moodType.service');

const router = express.Router();
const service = new MoodTypeService();

// Route to list all mood types
router.get('/', async (req, res, next) => {
  try {
    const moodTypes = await service.find();
    res.json(moodTypes);
  } catch (error) {
    next(error);
  }
});

// Route to create a new mood type
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newMoodType = await service.create(data);
    res.status(201).json(newMoodType);
  } catch (error) {
    next(error);
  }
});

// Route to edit a mood type
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedMoodType = await service.update(id, data);
    res.json(updatedMoodType);
  } catch (error) {
    next(error);
  }
});

// Route to delete a mood type
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
