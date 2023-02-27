'use strict'

const az = require('az')
const invertedIndex = require('mnemonist/inverted-index')
const createError = require('http-errors')
const fs = require('fs')
const { resolve } = require('path')
const { rejects } = require('assert')

var docs = [
    'лекции по математической теории устойчивости',
    'сборник задач по математическому анализу',

]

//var tokens = az.Tokens(name).done(['SPACE'], true )

// az.Morph.init(() => {
//     tokens.forEach(token => {
//         console.log(az.Morph(token.    toString())[0].normalize(true))
//     });
// })

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

        let array = await getRecordsArray(await readJson("j.json"));

        array = await Promise.all(array.map(async(obj) => {
            await extractWords(obj);
        }))


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
        return obj[key]
    }
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
    var docarray = new Array();

    let tokens = az.Tokens(objToExtract.TITLE).done(['SPACE', 'PUNCT'], true)

    return new Promise((resolve, reject) => {
        try {
            az.Morph.init(() => {
                tokens.map((token) => {
                    docarray.push(az.Morph(token.toString())[0].normalize(true).word)
                });
                resolve(objToExtract.TITLE = docarray)
            })
        }
        catch (err) {
            reject(err)
        }
    })

}
