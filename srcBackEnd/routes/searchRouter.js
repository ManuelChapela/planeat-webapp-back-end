const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.route('/')
.get(searchController.searchPrefs) //Nos da la preferencia de búsqueda del usuario si está registrado
.post(searchController.search)

module.exports = router;

