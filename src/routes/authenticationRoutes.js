// ./src/routes/authenticationRoutes.js
const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authenticationController');

router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);
router.post('/forgot-password', authenticationController.forgotPassword)
router.post('/new-password', authenticationController.newPasswordWithToken)
router.post('/new-password-logged', authenticationController.newPasswordLogged)
router.post('/register', authenticationController.register);

module.exports = router;
