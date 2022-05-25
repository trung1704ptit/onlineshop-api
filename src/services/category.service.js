const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return Category.create(categoryBody);
}

const getCategoryById = async (id) => {
  return Category.findById(id);
}

const queryCategories = async () => {
  return Category.find();
}

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
*/
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save()
  return category;
}

module.exports = {
  createCategory,
  updateCategoryById,
  queryCategories
}