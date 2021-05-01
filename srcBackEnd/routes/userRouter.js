const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/')
  //OK
  .get(userController.getUser)
  .patch(userController.updateUser)

module.exports = router;
