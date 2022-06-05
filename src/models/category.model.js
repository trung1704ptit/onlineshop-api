const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const slugify = require('../utils/slugify');

const categorySchema = mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true
  },
  icon: {
    type: String,
    default: null,
  },
  thumbnail: {
    type: String,
    default: null
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Category'
  },
  isShow: {
    type: Boolean,
    default: true
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      unique: true
    }
  }]
});

categorySchema.pre('save', async function (next) {
  this.slug = slugify(this.name);
  next();
})

// add plugin that converts mongoose to json
// categorySchema.plugin(toJSON);

/* @typedef Category */
const Category = mongoose.model('Category', categorySchema);


module.exports = Category;