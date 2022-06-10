const mongoose = require('mongoose');
// const { toJSON } = require('./plugins');
const slugify = require('../utils/slugify');

const categorySchema = mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  order: {
    type: Number,
    default: -1,
  },
  icon: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Category',
  },
  isShow: {
    type: Boolean,
    default: true,
  },
  ancestors: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
      },
      isShow: Boolean,
      name: String,
      slug: String,
      thumbnail: String,
      icon: String,
    },
  ],
});

categorySchema.pre('save', async function (next) {
  this.slug = slugify(this.name);
  next();
});

// add plugin that converts mongoose to json
// categorySchema.plugin(toJSON);

/* @typedef Category */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
