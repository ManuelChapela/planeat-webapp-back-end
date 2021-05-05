const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.updateUser);

router
  .route('/savebancat')
  .patch(userController.updateUserBannedCategories)
 // .post(userController.saveUserBannedCategories);


  //TODO: Ver como hacer el baneado de alimentos
router.route('/savebaning').patch(userController.updateUserBannedIngredients);


router.route('/addfav').post(userController.addUserFav);
router.route('/delfav').post(userController.delUserFav);
router.route('/fav').get(userController.getUserFav);

module.exports = router;
