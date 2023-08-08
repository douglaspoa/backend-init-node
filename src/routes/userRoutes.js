// ./src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.get('/impersonate/:userId', userController.impersonateUser);

module.exports = router;
