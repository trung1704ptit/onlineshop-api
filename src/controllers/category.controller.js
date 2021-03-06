const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req, res);
  res.status(httpStatus.CREATED).send({ category })
})

const getCategoryTree = catchAsync(async (req, res) => {
  const allCategory = await categoryService.getCategoryTree();
  res.send(allCategory)
})

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.send(category);
})

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.id, req.body)
  res.send(category)
})

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
})

const deleteBulkCategory = catchAsync(async (req, res) => {
  await categoryService.deleteBulkCategory(req.body.ids);
  res.status(httpStatus.NO_CONTENT).send();
})

const getAllCategories = (catchAsync(async (req, res) => {
  const allCategories =  await categoryService.getAllCategories();
  res.send(allCategories)
}))

module.exports = {
  createCategory,
  getCategoryTree,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteBulkCategory
}