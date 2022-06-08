const httpStatus = require('http-status');
const get = require('lodash/get');
const { Category } = require('../models');
const slugify = require('../utils/slugify');
const ApiError = require('../utils/ApiError');

/**
 * Build ancestors
 * @params {ObjectId} categoryId
 * @params {ObjectId} parentId
 */
const buildAncestors = async (categoryId, parentId) => {
  let ancestors = [];
  const parentCategory = await Category.findOne({ _id: parentId }, { name: 1, slug: 1, ancestors: 1 });

  if (parentCategory) {
    const { _id, name, image, slug, icon } = parentCategory;
    ancestors = [...parentCategory.ancestors];
    ancestors.unshift({ _id, name, slug, image, icon });
    await Category.findByIdAndUpdate(categoryId, { $set: { ancestors } });
  }
};

/**
 * Build ancestors
 * @params {ObjectId} categoryId
 * @params {ObjectId} parentId
 */
const buildHierarchyAncestors = async (categoryId, parentId) => {
  if (categoryId && parentId) {
    buildAncestors(categoryId, parentId);
    const result = await Category.find({ parent: categoryId });
    if (result) {
      result.forEach((doc) => {
        buildHierarchyAncestors(doc._id, categoryId);
      });
    }
  }
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

/**
 * Create a Category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (req) => {
  const categoryBody = req.body;
  const slug = slugify(categoryBody.name);
  const exist = await Category.find({ slug });

  const thumbnailFilename = get(req, `files.thumbnail[0].location`, '');
  const iconFilename = get(req, `files.icon[0].location`, '');

  if (exist && exist.length > 0) {
    throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
  }

  categoryBody.thumbnail = thumbnailFilename;
  categoryBody.icon = iconFilename;

  const newCategory = await Category.create(categoryBody);
  await buildHierarchyAncestors(newCategory.id, categoryBody.parent);
  return getCategoryById(newCategory._id);
};

/**
 * Get all categories
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async () => {
  const result = await Category.aggregate([
    {
      $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parent',
        depthField: 'level',
        as: 'children',
      },
    },
    {
      $unwind: {
        path: '$children',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        'children.level': -1,
      },
    },
    {
      $group: {
        _id: '$_id',
        parent: {
          $first: '$parent',
        },
        name: {
          $first: '$name',
        },
        slug: {
          $first: '$slug',
        },
        icon: {
          $first: '$icon',
        },
        thumbnail: {
          $first: '$thumbnail',
        },
        children: {
          $push: '$children',
        },
        ancestors: {
          $first: '$ancestors',
        },
        isShow: {
          $first: '$isShow',
        },
        updatedAt: {
          $first: '$updatedAt',
        },
      },
    },
    {
      $addFields: {
        children: {
          $reduce: {
            input: '$children',
            initialValue: {
              level: -1,
              presentChild: [],
              prevChild: [],
            },
            in: {
              $let: {
                vars: {
                  prev: {
                    $cond: [
                      {
                        $eq: ['$$value.level', '$$this.level'],
                      },
                      '$$value.prevChild',
                      '$$value.presentChild',
                    ],
                  },
                  current: {
                    $cond: [
                      {
                        $eq: ['$$value.level', '$$this.level'],
                      },
                      '$$value.presentChild',
                      [],
                    ],
                  },
                },
                in: {
                  level: '$$this.level',
                  prevChild: '$$prev',
                  presentChild: {
                    $concatArrays: [
                      '$$current',
                      [
                        {
                          $mergeObjects: [
                            '$$this',
                            {
                              children: {
                                $filter: {
                                  input: '$$prev',
                                  as: 'e',
                                  cond: {
                                    $eq: ['$$e.parent', '$$this._id'],
                                  },
                                },
                              },
                            },
                          ],
                        },
                      ],
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        children: '$children.presentChild',
      },
    },
  ]);
  return result;
};

/**
 * Update category by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (id, updateBody) => {
  const category = await getCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, updateBody);
  await category.save();
  await buildHierarchyAncestors(id, updateBody.parent);
  return getCategoryById(category._id);
};

/**
 * Delete category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

/**
 * Delete bulk category
 * @returns {Promise<Category>}
 */
const deleteBulkCategory = async (ids) => {
  await Category.deleteMany({
    _id: {
      $in: ids,
    },
  });
  return null;
};

module.exports = {
  createCategory,
  deleteCategoryById,
  deleteBulkCategory,
  getCategoryById,
  updateCategoryById,
  queryCategories,
};
