const joi = require('joi');

const id = joi.string().uuid();
const mood = joi.string().valid('happy', 'sad', 'angry', 'neutral');
const date = joi.date().iso();
const userId = joi.string().pattern(/^user_[a-zA-Z0-9]+$/);
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
  .object({
    userId: userId.required(),
  })
  .or('userId');

module.exports = {
  createMoodEntrySchema,
  getMoodEntrySchema,
  getOneMoodEntrySchema,
};
