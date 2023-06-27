'use strict'

const express = require('express');
const router = express.Router();

const searchController = require('./searchController');

router.get('/', searchController.getSearch);

router.get('/upload', searchController.getUpload);

//router.get('/createIndex', searchController.postCreateIndex);

router.post('/', searchController.postSearch);

module.exports = router;