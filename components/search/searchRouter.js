'use strict'

const express = require('express');
const router = express.Router();

const searchController = require('./searchController');

router.get('/', searchController.getSearch);

router.get('/upload', searchController.getUpload);

router.post('/', searchController.postSearch);

router.get('/createIndex', searchController.postCreateIndex);

module.exports = router;