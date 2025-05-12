const express = require('express');
const TagService = require('../services/tag.service');

const router = express.Router();
const service = new TagService();

// Route to list all tags
router.get('/', async (req, res, next) => {
  try {
    const tags = await service.find();
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// Route to create a new tag
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const newTag = await service.create(data);
    res.status(201).json(newTag);
  } catch (error) {
    next(error);
  }
});

// Route to edit a tag
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedTag = await service.update(id, data);
    res.json(updatedTag);
  } catch (error) {
    next(error);
  }
});

// Route to delete a tag
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
