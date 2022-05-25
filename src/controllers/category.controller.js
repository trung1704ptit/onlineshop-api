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

module.exports = {
  createCategory,
  getAllCategories
}