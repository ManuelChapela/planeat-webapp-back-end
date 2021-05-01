const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/')
  //OK
  .get(userController.getUser)
  .patch(userController.updateUser)


  router
    .route('/saveBanned')
    //OK
    .patch(userController.updateUserBannedCategories);

module.exports = router;
