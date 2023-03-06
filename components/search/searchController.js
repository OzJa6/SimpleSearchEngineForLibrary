'use strict'

const az = require('az')
const invertedIndex = require('mnemonist/inverted-index')
const createError = require('http-errors')
const fs = require('fs')

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
        var index = new invertedIndex()

        let array = await prepareRecords("QUICKR_INFO_202302171551.json")
//todo 
//Error: Please call Az.Morph.init() before using this module.
//at Object.Morph (D:\git\search\node_modules\az\dist\az.js:665:13)
//at D:\git\search\components\search\searchController.js:94:40

//ошибкба в браузере!!!!!!!!!!!!

        console.log(array)
        res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'bad' });
    }
}

async function readJson(path) {
    let fileContent = fs.readFileSync(path, 'utf-8')
    let json = await JSON.parse(fileContent)
    return json;
}

async function getRecordsArray(obj) {
    for (let key in obj) {
        return obj[key];
    }
}

async function prepareRecords(path) {
    let array = new Array()
    await Promise.all((await getRecordsArray(await readJson(path))).map(async (obj) => {
        await extractWords(obj);
        array.push(obj)
    }))
    return array;
}

async function WordCount(doc, word) {
    return doc.reduce((accumulator, documentWord) => {
        if (documentWord == word)
            accumulator++;
    }, 0)
}

/**
 * Обертка в промис колбека для az.morph
 * @param {object} objToExtract - объект с полями TITLE и AUTHORS, слова в которых будут разделены и нормализованы(приведены в начальную форму)
 * @returns Promise: resolve нормализованный объект
 */

async function extractWords(objToExtract) {
    var wordsArray = new Array();

    let tokens = az.Tokens(objToExtract.TITLE).done(['SPACE', 'PUNCT'], true)

    return new Promise((resolve, reject) => {
        try {
            az.Morph.init(() => {
                tokens.map((token) => {//отдельная функция, if resolve (true)
                    wordsArray.push(az.Morph(token.toString())[0].normalize(true).word)
                });
                resolve(objToExtract.TITLE = wordsArray)//resolve (true)
            })
        }
        catch (err) {
            reject(err)
        }
    })

}
