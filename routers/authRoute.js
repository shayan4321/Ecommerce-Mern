const express = require('express');
const registerController = require("../controllers/authController");

// Import Middleware
const authMiddleware = require('../middlewares/authMiddleware')

//router object
const router = express.Router();

//routing 
// Register router method post
router.post('/register', registerController.registerController)

// LOGIN || POST
router.post('/login',registerController.loginController)

// Forget Passowrd
router.post('/forgot-password', registerController.forgotPasswordController)

// test Route
router.get('/test', authMiddleware.requireSignIn, authMiddleware.isAdmin, registerController.testController)
// authMiddleware.requireSignIn (for Check Token) & authMiddleware.isAdmin (For Admin Check)

// Protected User Route auth
router.get('/user-auth',authMiddleware.requireSignIn, (req,res)=>{
    res.status(200).send({ok:true})
})

// Protected Admin Route auth
router.get('/admin-auth',authMiddleware.requireSignIn, authMiddleware.isAdmin, (req,res)=>{
    res.status(200).send({ok:true})
})

// Update Profile
router.put('/profile', authMiddleware.requireSignIn, registerController.updateProfileController)

// Orders
router.get('/orders', authMiddleware.requireSignIn, registerController.getOrdersController)

// All Orders
router.get('/all-orders', authMiddleware.requireSignIn, authMiddleware.isAdmin, registerController.getAllOrdersController)

// Orders Status Update
router.put('/order-status/:orderId', authMiddleware.requireSignIn, authMiddleware.isAdmin, registerController.orderStatusController)

module.exports = router