const express = require('express');
const { loginController, registerController, forgotPassController, resetPassController } = require('../controllers/userController');

// router object
const router = express.Router();

// login route 
router.post('/login', loginController)

// forgot password rout
router.post('/forgot-password', forgotPassController);

// forgot password rout
router.post('/reset-password/:token', resetPassController);

// register route 
router.post('/register', registerController)

module.exports = router;