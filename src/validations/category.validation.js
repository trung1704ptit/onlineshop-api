const Joi = require('joi');
const { slug, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    // slug: Joi.string().required().custom(slug)
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
  deleteCategory,
  getCategoryById
}