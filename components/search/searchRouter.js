'use strict'

const express = require('express');
const router = express.Router();

const searchController = require('./searchController');

router.get('/', searchController.getSearch);

router.get('/createIndex', searchController.CreateIndex);

router.post('/', searchController.postSearch);

module.exports = router;