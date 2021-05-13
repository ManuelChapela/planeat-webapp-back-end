const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { isLogged } = require('../controllers/loginController');
const {getFavsMiddle} = require('../utilities/profile/profile');

router
  .route('/')
  .get(searchController.searchPrefs) //Nos da la preferencia de búsqueda del usuario si está registrado
  .post(isLogged) //mira si el usuario está logeado
  .post(getFavsMiddle) //consigue los favoritos del usuario
  .post(searchController.search);

module.exports = router;
