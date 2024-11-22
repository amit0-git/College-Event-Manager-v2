const express = require('express');

const userController = require('../controller/userController');

const router = express.Router();


router.post('/signup', userController.signup);
// router.post('/sendOtp', userController.sendOtp);
router.post('/login', userController.login);
router.post('/register',userController.register);
router.post('/getData',userController.getData);
router.post('/logout',userController.logout);


module.exports = router;