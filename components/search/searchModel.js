'use strict'

const mongoDB = require('../../mongo')
const config = require('../../config.json')

module.exports.add = async (collection, document) => {
    return await mongoDB.add(config.mongoDB.databaseName, collection, document);
}

module.exports.getById = async (collection, id) => {
    return await mongoDB.getById(config.mongoDB.databaseName, collection, id);
}

module.exports.getByQuery = async (collection, query) => {
    return await mongoDB.getByQuery(config.mongoDB.databaseName, collection, query);
}

module.exports.getAll = async (collection, query) => {
    return await mongoDB.getAll(config.mongoDB.databaseName, collection, query)
}

module.exports.removeById = async (collection, id) => {
    return await mongoDB.removeById(config.mongoDB.databaseName, collection, id);
}

module.exports.removeByQuery = async (collection, query) => {
    return await mongoDB.removeByQuery(config.mongoDB.databaseName, collection, query);
}

