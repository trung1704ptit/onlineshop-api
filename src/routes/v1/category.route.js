const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
});

const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
    },
  }),
});

const router = express.Router();

router
  .route('/')
  .post(
    upload.fields([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories)
  .delete(validate(categoryValidation.deleteBulkCategory), categoryController.deleteBulkCategory);

router
  .route('/:id')
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory)
  .patch(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .get(validate(categoryValidation.getCategoryById), categoryController.getCategoryById);

module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: Category management
 */

/**
 * @swagger
 * /categories:
 *  post:
 *    summary: Create a category
 *    tags: [Category]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *              image:
 *                type: string
 *                format: binary
 *              parent:
 *                type: string
 *              ancestors:
 *                type: array
 *                items:
 *                  type: string
 *            example:
 *              name: Sport and Beauty
 *              parent: 89jdskd023928329232sghsd2
 *              ancestors: [3123235dasdsad3434, 4234dasdasd643rfdfd]
 *
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Category'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 *  get:
 *    summary: Get all categories
 *    tags: [Category]
 *    requestBody:
 *      required: false
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Category'
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbidden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /categories/{id}:
 *  delete:
 *    summary: Delete a category
 *    description: Logged in user can delete Category
 *    tags: [Category]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: cateogry id
 *    responses:
 *      "200":
 *        description: No content
 *      "401":
 *        $ref: '#/components/responses/Unauthorized'
 *      "403":
 *        $ref: '#/components/responses/Forbiden'
 *      "404":
 *        $ref: '#/components/responses/NotFound'
 *
 *  get:
 *    summary: Get a category by id
 *    tags: [Category]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: category id
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *  patch:
 *    summary: Update a category
 *    description: Logged in user can only update the category.
 *    tags: [Category]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: category id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *            parent:
 *                type: string
 *            ancestors:
 *               type: array
 *               items:
 *                 type: string
 *            example:
 *              name: Sport and Beauty
 *              parent: 89jdskd023928329232sghsd2
 *              ancestors: [3123235dasdsad3434, 4234dasdasd643rfdfd]
 *    responses:
 *       "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */
