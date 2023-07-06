const express = require('express')
const productController = require("../controllers/productController");
const formidable = require('express-formidable');

// Import Middleware
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

//===================================== Routes =============================

// Create Product
router.post('/create-product', authMiddleware.requireSignIn, authMiddleware.isAdmin, formidable(), productController.createProductController)

// Get All Product
router.get('/get-product', productController.getProductController)

// Get Single Product
router.get('/get-product/:slug', productController.getSingleProductController) // product ka slug pass krna h.

// Get Photo
router.get('/product-photo/:pid', productController.productPhotoController)

// Delete Product
router.delete('/delete-product/:pid', productController.deleteProductController)

// Update Product
router.put('/update-product/:pid', authMiddleware.requireSignIn, authMiddleware.isAdmin, formidable(), productController.updateProductController)

// Filter Product
router.post('/product-filters', productController.productFilterController)

// Product Count (Pagination)
router.get('/product-count', productController.productCountController)

// Product Per Page
router.get('/product-list/:page', productController.productListController)

// Search Product
router.get('/search/:keyword', productController.searchProductController)

// Similar Product
router.get('/related-product/:pid/:cid', productController.relatedProductController)

// Category wise Product
router.get('/product-category/:slug', productController.productCategoryController)

// Payment Routes
//token
router.get('/braintree/token', productController.braintreeTokenController)

// Payment
router.post('/braintree/payment', authMiddleware.requireSignIn, productController.brainTreePaymentController)


module.exports = router