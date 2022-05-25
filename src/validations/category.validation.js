const Joi = require('joi');
const { slug } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required().custom(slug)
  })
}

module.exports = {
  createCategory
}