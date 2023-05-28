'use strict'

const { query } = require('express');
const mongoDB = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const config = require('./config.json').mongoDB;

const MONGODB_URI = config.localURI;

const mongoClient = new mongoDB.MongoClient(MONGODB_URI, { useUnifiedTopology: true });

let dbclient = null;

mongoClient.connect()
    .then(client => {
        console.log('mongo connect is open');
        dbclient = client;
    })
    .catch(err => {
        console.log(err);
    })


module.exports.add = (database, collection, document) => {
    return new Promise((resolve, reject) => {
        try {
            dbclient
                .db(database)
                .collection(collection)
                .insertOne(document)
                .then(() => {
                    resolve();
                });
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.update = (database,collection,id, document) => {
    return new Promise((resolve, reject) => {
        try {
            dbclient
            .db(database)
            .collection(collection)
            .updateOne({_id: ObjectID(id)},{$set: {document}})
        } catch (error) {
            reject(error)
        }
    })
}

module.exports.getById = (database, collection, id) => {
    return new Promise((resolve, reject) => {
        try {
            dbclient
                .db(database)
                .collection(collection)
                .find({ _id: ObjectID(id) })
                .toArray((error, result) => {
                    if (error)
                        reject(error);
                    resolve(result);
                })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.getBuQuery = (database, collection, query) => {
    return new Promise((resolve, reject) => {
        try {
            dbclient
                .db(database)
                .collection(collection)
                .find(query)
                .toArray((error, result) => {
                    if (error)
                        reject(error);
                    resolve(result);
                })
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.getCollection = (database, collection) => {
    return new Promise((resolve, reject) => {
        try {
            dbclient
                .db(database)
                .collection(collection)
                .find({})
                .toArray((error, result) => {
                    if (error)
                        reject(error);
                    resolve(result);
                })
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * Функция removeById - Удаление документа по id
 * @param {string} id - Id документа
 * @param {string} database - База данных, в которой искать
 * @param {string} collection - Коллекция, в которой искать
 * @returns Promise: resolve массив документов
 */

module.exports.removeById = async (database, collection, id) => { // Удаление документа по id
    await dbClient
        .db(database)
        .collection(collection)
        .deleteOne({ _id: ObjectId(id) });
}

/**
 * Функция removeByQuery - Удаление из базы по объекту
 * @param {string} database - База данных, в которой искать
 * @param {string} collection - Коллекция, в которой искать
 * @param {string} query - Query объект для поиска 
 * @returns Promise: resolve массив документов
 */

module.exports.removeByQuery = async (database, collection, query) => { // Удаление документов по объекту
    await dbClient.db(database).collection(collection).deleteMany(query);
}

/**
 * 
 * @returns Promise: закрывает открытое соединение
 */

module.exports.closeMongoConnection = () => {
    return new Promise((resolve, reject) => {
      if (dbClient === null) reject(new Error('No connection to Mongo'));
      else {
        dbClient.close()
        .then(() => {
          console.log('Connection to Mongo is closed');
          resolve();
        })
        .catch(err =>{
          reject(err);
        });
      }
    });
  }