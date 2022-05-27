const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send({ category })
})

const getAllCategories = catchAsync(async (req, res) => {
  const allCategory = await categoryService.queryCategories();
  res.send(allCategory)
})

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.send(category);
})

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.id);
  res.send(httpStatus.NO_CONTENT).send();
})

module.exports = {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById
}