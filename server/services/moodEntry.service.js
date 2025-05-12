const { Op } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance

class MoodEntryService {
  async create(data) {
    try {
      const moodEntry = await models.MoodEntry.create(data);
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error creating mood entry', error);
    }
  }

  async findOne(id) {
    try {
      const moodEntry = await models.MoodEntry.findByPk(id);
      if (!moodEntry) {
        throw Boom.notFound('Mood entry not found');
      }
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error fetching mood entry', error);
    }
  }

  async find(filters = {}) {
    try {
      const moodEntries = await models.MoodEntry.findAll({
        where: filters,
      });
      return moodEntries;
    } catch (error) {
      throw Boom.badImplementation('Error fetching mood entries', error);
    }
  }

  async update(id, data) {
    try {
      const moodEntry = await this.findOne(id);
      await moodEntry.update(data);
      return moodEntry;
    } catch (error) {
      throw Boom.badImplementation('Error updating mood entry', error);
    }
  }

  async delete(id) {
    try {
      const moodEntry = await this.findOne(id);
      await moodEntry.destroy();
      return { message: 'Mood entry deleted successfully' };
    } catch (error) {
      throw Boom.badImplementation('Error deleting mood entry', error);
    }
  }
}

module.exports = MoodEntryService;
