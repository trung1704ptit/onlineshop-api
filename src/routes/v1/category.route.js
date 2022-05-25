const express = require('express');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router.post('/create', validate(categoryValidation), categoryController.create)


module.exports = router;

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: Category
*/

/**
 * @swagger
 * /category/create:
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
 *                
*/