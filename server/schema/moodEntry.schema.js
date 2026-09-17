const joi = require('joi');

const id = joi.number().integer().positive();
const mood = joi.string().valid('Alegría', 'Calma', 'Ansiedad', 'Tristeza', 'Enojo');
const date = joi.date().iso();
const note = joi.string().max(500);

const createMoodEntrySchema = joi.object({
  mood: mood.required(),
  date: date.required(),
  note: note.required(),
});

const getOneMoodEntrySchema = joi.object({
  id: id.required(),
});

const getMoodEntrySchema = joi
  .object()
  .unknown(false);

module.exports = {
  createMoodEntrySchema,
  getMoodEntrySchema,
  getOneMoodEntrySchema,
};
