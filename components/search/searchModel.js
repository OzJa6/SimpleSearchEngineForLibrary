'use strict'

const mongoDB = require('../../mongo')

module.exports.add = async (document) => {
    return await mongoDB.add('InvertedIndex','InvertedIndex', document);
}

module.exports.getById = async (id) => {
    return await mongoDB.getById('InvertedIndex','InvertedIndex', id);
}

module.exports.getByQuery = async (query) => {
    return await mongoDB.getByQuery('InvertedIndex','InvertedIndex', query);
}

module.exports.removeById = async (id) => {
    return await mongoDB.removeById('InvertedIndex','InvertedIndex', id);
}

module.exports.removeByQuery = async (query) => {
    return await mongoDB.removeByQuery('InvertedIndex','InvertedIndex', query);
}

