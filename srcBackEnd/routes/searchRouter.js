const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.route('/')
.get(searchController.searchRouter); //Nos da la preferencia de búsqueda del usuario si está registrado

module.exports = router;

