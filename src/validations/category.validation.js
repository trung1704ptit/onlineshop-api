const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().allow(null, ''),
    parent: Joi.string().allow(null, ''),
    ancestors: Joi.array().items(Joi.string()).allow(null),
    icon: Joi.string().allow(null, ''),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(null, ''),
    parent: Joi.string().allow(null, ''),
    ancestors: Joi.array().items(Joi.string()).allow(null),
    icon: Joi.string().allow(null, ''),
    thumbnail: Joi.string().allow(null, ''),
    order: Joi.number().allow(null, 0),
    isShow: Joi.boolean().allow(null, ''),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const deleteBulkCategory = {
  body: Joi.object().keys({
    ids: Joi.array().items(Joi.string()),
  }),
};

const getCategoryById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteBulkCategory,
  getCategoryById,
};
