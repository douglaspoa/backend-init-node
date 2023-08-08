// ./src/routes/roleRoutes.js
const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');

router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:roleId', roleController.getRole);
router.put('/:roleId', roleController.updateRole);
router.delete('/:roleId', roleController.deleteRole);

module.exports = router;
