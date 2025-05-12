const { Op } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance

class MoodEntryTagService {
  async create(data) {
    try {
      const moodEntryTag = await models.MoodEntryTag.create(data);
      return moodEntryTag;
    } catch (error) {
      throw Boom.badImplementation('Error creating MoodEntryTag', error);
    }
  }

  async findOne(id) {
    try {
      const moodEntryTag = await models.MoodEntryTag.findByPk(id);
      if (!moodEntryTag) {
        throw Boom.notFound('MoodEntryTag not found');
      }
      return moodEntryTag;
    } catch (error) {
      throw Boom.badImplementation('Error fetching MoodEntryTag', error);
    }
  }

  async find(filters = {}) {
    try {
      const moodEntryTags = await models.MoodEntryTag.findAll({
        where: filters,
      });
      return moodEntryTags;
    } catch (error) {
      throw Boom.badImplementation('Error fetching MoodEntryTags', error);
    }
  }

  async update(id, data) {
    try {
      const moodEntryTag = await this.findOne(id);
      await moodEntryTag.update(data);
      return moodEntryTag;
    } catch (error) {
      throw Boom.badImplementation('Error updating MoodEntryTag', error);
    }
  }

  async delete(id) {
    try {
      const moodEntryTag = await this.findOne(id);
      await moodEntryTag.destroy();
      return { message: 'MoodEntryTag deleted successfully' };
    } catch (error) {
      throw Boom.badImplementation('Error deleting MoodEntryTag', error);
    }
  }
}

module.exports = MoodEntryTagService;
