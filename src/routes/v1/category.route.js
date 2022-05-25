const express = require('express');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router.route('/')
  .post(validate(categoryValidation), categoryController.createCategory)
  .get(validate(categoryValidation), categoryController.getAllCategories)


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