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

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
*/
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
}

/**
 * Get all categories
 * @returns {Promise<QueryResult>}
*/
const queryCategories = async () => {
  return Category.find();
}

/**
 * Update category by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Category>}
*/
const updateCategoryById = async (id, updateBody) => {
  const category = await getCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save()
  return category;
}

/**
 * Delete category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
*/
const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
}

module.exports = {
  createCategory,
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
  queryCategories
}