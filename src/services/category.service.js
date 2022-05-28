const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');


/**
 * Build ancestors
 * @params {ObjectId} categoryId
 * @params {ObjectId} parentId
*/
const buildAncestors = async (categoryId, parentId) => {
  let ancestors = [];
  let parent_category = await Category.findOne({ "_id": parentId }, { "name": 1, "slug": 1, "ancestors": 1 })

  if (parent_category) {
    const { _id, name, image, slug } = parent_category;
    ancestors = [...parent_category.ancestors];
    ancestors.unshift({ _id, name, slug, image })
    await Category.findByIdAndUpdate(categoryId, { $set: { "ancestors": ancestors } })
  }
}

/**
 * Build ancestors
 * @params {ObjectId} categoryId
 * @params {ObjectId} parentId
*/
const buildHierarchyAncestors = async (categoryId, parentId) => {
  if (categoryId && parentId) {
    buildAncestors(categoryId, parentId);
    const result = await Category.find({ 'parent': categoryId });
    if (result) {
      result.forEach(doc => {
        buildHierarchyAncestors(doc._id, categoryId);
      })
    }
  }
}

/**
 * Create a Category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  const newCategory = await Category.create(categoryBody);
  await buildHierarchyAncestors(newCategory.id, categoryBody.parent)
  return getCategoryById(newCategory._id)
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
  await buildHierarchyAncestors(id, updateBody.parent);
  return getCategoryById(category._id)
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