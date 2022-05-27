const Joi = require('joi');
const { slug, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    // slug: Joi.string().required().custom(slug)
  })
}

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required().custom(slug),
    parent: Joi.string(),
    ancestors: Joi.array().items(Joi.string())
  })
}

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
}

const getCategoryById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
}