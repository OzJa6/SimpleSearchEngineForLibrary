'use strict'

const az = require('az');
const createError = require('http-errors');
const fs = require('fs');

const searchModel = require('./searchModel');

const pattern1 = /[А-Яа-я]{1,15}-$/
const pattern2 = /[A-Za-zА-Яа-я]{1,15}-[0-9]{1,5}$/
module.exports.getSearch = async (req, res, next) => {
    try {
        res.render('./search/views/search.pug', {
            title: 'Поиск'
        })
    }
    catch (err) {
        next(err);
    }
}

module.exports.postSearch = async (req, res) => {
    try {
        let array = await prepareRecords("QUICKR_INFO_202302171551.json", 200)
        let invertedIndex = await createInvertedIndexArray(array)
        let idf = await calcIDF(invertedIndex,array.length)

        

        /**
         * TODO:
         * 1)записать в монгу каждый элемент массива как отдельный документ.
         * -----2)написать процедуру проверки айдишников записей если книга выведена из оборота.
         * 3)написать обработчик поискового запроса
         * 4)ранжирования ответа
         */

        console.log(idf)
        res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'bad' });
    }
}

async function d(path) {
    let array = await prepareRecords(path)
    let invertedIndex = await createInvertedIndexArray(array)
    let idf = await calcIDF(invertedIndex,array.length)
}

async function readJson(path) {
    let fileContent = fs.readFileSync(path, 'utf-8')
    let json = await JSON.parse(fileContent)
    return Object.values(json)[0];
}

function prepareRecords(path) {
    return new Promise(async (resolve, reject) => {
        try {
            let chunkArray = await readJson(path);
            az.Morph.init(async () => {
                const chunkArrayPromises = chunkArray.map((record) => extractWords(record))
                const resolvedapromises = await Promise.all(chunkArrayPromises)
                resolve(resolvedapromises);
            })
        } catch (error) {
            reject(error)
        }

    })
}

/**
 * Обертка в промис колбека для az.morph
 * @param {object} objToExtract - объект с полями TITLE и AUTHORS, слова в которых будут разделены и нормализованы(приведены в начальную форму)
 * @returns Promise: resolve нормализованный объект
 */

function extractWords(objToExtract) {
    return new Promise((resolve, reject) => {
        try {
            var wordsArray = new Array();

            let tokens = az.Tokens(objToExtract.TITLE).done(['SPACE', 'PUNCT'], true)

            for (let i = 0; i < tokens.length; i++) {
                //обработка ошибок ввода типа "планово- экономический" вместо "планово-экономический"
                if (pattern1.test(tokens[i].toString()) && i < tokens.length - 2) {
                    tokens.splice(i, 2, tokens[i].toString() + tokens[i + 1].toString())
                }
                //обработка маркоровок типа "Т. 5" (том пятый)
                if (tokens[i].toString() == 'Т' && tokens[i + 1].type == az.Tokens.NUMBER) {
                    tokens.splice(i, 2, 'Том ' + tokens[i + 1].toString())
                }
            }

            tokens.map((token) => {

                if (az.Morph(token.toString())[0] != undefined)
                    wordsArray.push(az.Morph(token.toString())[0].normalize(true).word)
                else
                    //обработка нечитаемых аббревиатур с числами (ваз-2107, Olimp-80)
                    if (pattern2.test(token.toString())) {
                        wordsArray.push(token.toString())
                    }
            })
            objToExtract.TITLE = wordsArray;
            resolve(objToExtract)

        }
        catch (err) {
            reject(err)
        }
    })

}

/**
 * 
 * @param {array} recordsArray 
 * @returns Promise: resolve массив, содержащий объекты формата:
 * {
 *  word: word,
 *  count: 1,
 *  recordsIds: [record.RECORD_ID]
 * }
 */

function createInvertedIndexArray(recordsArray) {
    return new Promise((resolve, reject) => {
        try {
            let index = new Array();
            
            recordsArray.map((record) => {
                record.TITLE.map((word) => {
                    let position = index.findIndex(obj => obj.word === word)
                    if (position != -1) {
                        index[position].count++;
                        index[position].recordsIds.push(record.RECORD_ID);
                    }
                    else {
                        index.push(
                            {
                                word: word,
                                count: 1,
                                recordsIds: [record.RECORD_ID]
                            });
                    }
                })
            })
            resolve(index);
        } catch (error) {
            reject(error);
        }
    })

}

/**
 * 
 * @param {*} invertedIndex обратный индекс: массив, содержащий объекты формата (см выше)
 * @param {*} recordsArrayLegnth количество документов в корпусе(длинна массива документов)
 * @returns Promise: массив с объектами формата (см выше) + поле IDF
 */

function calcIDF(invertedIndex, recordsArrayLegnth) {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < invertedIndex.length; i++) {
                let IDF = Math.log((recordsArrayLegnth - invertedIndex[i].recordsIds.length + 0.5) / (invertedIndex[i].recordsIds.length + 0.5));
                if (IDF > 0)
                    invertedIndex[i].IDF = IDF;
                else
                    invertedIndex.splice(i, 1)
            };
            resolve(invertedIndex);
        } catch (error) {
            reject(error);
        }
    })
}