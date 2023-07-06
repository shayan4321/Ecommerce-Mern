const express = require('express')
const createCategoryController = require("../controllers/categoryController");

// Import Middleware
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

//routes

// Create Category
router.post('/create-category', authMiddleware.requireSignIn, authMiddleware.isAdmin,  createCategoryController.createCategoryController)

// Update Category
router.put('/update-category/:id', authMiddleware.requireSignIn, authMiddleware.isAdmin, createCategoryController.updateCategoryController)

//Get All Category
router.get('/get-category', createCategoryController.categoryController)

// Single Category
router.get('/single-category/:slug', createCategoryController.singleCategoryController)

// Delete Category
router.delete('/delete-category/:id', authMiddleware.requireSignIn, authMiddleware.isAdmin, createCategoryController.deleteCategoryController)

module.exports = router