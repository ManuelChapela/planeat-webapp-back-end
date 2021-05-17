const express = require('express');
const router = express.Router();
const {
  searchPrefs,
  search,
  searchById,
  saveSearchPrefs,
} = require('../controllers/searchController');
const { isLogged, authUser } = require('../controllers/loginController');
const { getFavsMiddle } = require('../utilities/profile/profile');

router
  .route('/')
  .get(searchPrefs) //Nos da la preferencia de búsqueda del usuario si está registrado
  .patch(authUser) //mira si el usuario está logeado
  .patch(saveSearchPrefs) //guarda la preferencia de búsqueda del usuario
  .post(isLogged) //mira si el usuario está logeado
  .post(getFavsMiddle) //consigue los favoritos del usuario
  .post(search);

router
  .route('/:id')
  .get(isLogged) //mira si el usuario está logeado
  .get(getFavsMiddle) //consigue los favoritos del usuario
  .get(searchById);

module.exports = router;
