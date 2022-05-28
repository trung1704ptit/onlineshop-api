const Joi = require('joi');
const { slug, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().allow(null, ''),
    parent: Joi.string().allow(null, ''),
    ancestors: Joi.array().items(Joi.string()).allow(null)
  })
}

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    parent: Joi.string().allow(null, ''),
    ancestors: Joi.array().items(Joi.string()).allow(null)
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