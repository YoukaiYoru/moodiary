const { Op } = require('sequelize');
const Boom = require('@hapi/boom');
const { models } = require('../libs/sequelize'); // Adjust the path to your sequelize instance

class MoodEntryTagService {
  async create(data, userId) {
    try {
      await this.assertEntryOwnership(userId, data.entry_id);
      const moodEntryTag = await models.MoodEntryTag.create(data);
      return moodEntryTag;
    } catch (error) {
      throw Boom.badImplementation('Error creating MoodEntryTag', error);
    }
  }

  async assertEntryOwnership(userId, entryId) {
    const entry = await models.MoodEntry.findOne({
      where: { id: entryId, user_id: userId },
    });
    if (!entry) throw Boom.notFound('Mood entry not found');
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

  async findForUser(userId) {
    const entries = await models.MoodEntry.findAll({
      where: { user_id: userId },
      attributes: ['id'],
      raw: true,
    });
    if (entries.length === 0) return [];
    return this.find({ entry_id: { [Op.in]: entries.map(({ id }) => id) } });
  }

  async findOneForUser(userId, entryId, tagId) {
    const relation = await models.MoodEntryTag.findOne({
      where: { entry_id: entryId, tag_id: tagId },
    });
    if (!relation) throw Boom.notFound('MoodEntryTag not found');
    await this.assertEntryOwnership(userId, relation.entry_id);
    return relation;
  }

  async update(id, data, userId) {
    try {
      const moodEntryTag = await this.findOneForUser(userId, id.entryId, id.tagId);
      if (data.entry_id) await this.assertEntryOwnership(userId, data.entry_id);
      await moodEntryTag.update(data);
      return moodEntryTag;
    } catch (error) {
      throw Boom.badImplementation('Error updating MoodEntryTag', error);
    }
  }

  async delete(id, userId) {
    try {
      const moodEntryTag = await this.findOneForUser(userId, id.entryId, id.tagId);
      await moodEntryTag.destroy();
      return { message: 'MoodEntryTag deleted successfully' };
    } catch (error) {
      throw Boom.badImplementation('Error deleting MoodEntryTag', error);
    }
  }
}

module.exports = MoodEntryTagService;
