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
        let obj = {
            "RECORD_ID": 82151,
            "TITLE": "Точка опоры",
            "PUBLISHERS": "Педагогика",
            "YEAR_OF_PUBLISHING": "1987",
            "AUTHORS": "Шаталов В. Ф."
        }
        await extractWords(obj);
        console.log(obj)
        //КОММЕНТ//
        //полулили массивы нормализованных слов для каждого названия.
        //теперь нужно сделать им TF-IDF
        //затем сделать значимым словам обратный индекс
        //КОММЕНТ//
        let file = await readJson("j.json");
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

async function WordCount(doc, word) {
    return doc.reduce((accumulator, documentWord) => {
        if (documentWord == word)
            accumulator++;
    }, 0)
}


//КОММЕНТ//
//полулили массивы нормализованных слов для каждого названия.
//теперь нужно сделать им TF-IDF
//затем сделать значимым словам обратный индекс
//КОММЕНТ//
async function extractWords(objToExtract) {
    var docarray = new Array();
    // let promisesDocs = docs.map((doc) => {
    //     return new Promise((resolve, reject) => {
    //         let tokens = az.Tokens(doc).done(['SPACE', 'PUNCT'], true)

    //         az.Morph.init(() => {
    //             let buff = new Array();
    //             tokens.map((token) => {
    //                 buff.push(az.Morph(token.toString())[0].normalize(true).word)
    //             });
    //             docarray.push(buff)
    //             console.log(docarray);
    //         })

    //     })
    // })

    return await new Promise((resolve, reject) => {
        let tokens = az.Tokens(objToExtract.TITLE).done(['SPACE', 'PUNCT'], true)

        az.Morph.init(() => {
            let buff = new Array();
            tokens.map((token) => {
                docarray.push(az.Morph(token.toString())[0].normalize(true).word)
            });
            //docarray.push(buff)
            console.log(docarray);
        })
        objToExtract.TITLE=docarray
    })

}


//console.log(docarray)

// az.Morph.init(() => {
//     tokens.forEach(token => {
//         console.log(az.Morph(token.    toString())[0].normalize(true))
//     });
// })






// keywords.forEach(keyword => {
//     //console.log(keywords)
//     tokens = az.Tokens(keyword).done(['SPACE', 'PUNCT'], true )
//     // console.log(tokens[0].source.substring(tokens[0].st, tokens[0].st + tokens[0].length))
//     tokens.forEach(token => {
//         // buff.push(token.source.substring(token.st, token.st + token.length))
//     })
//     index.add()

// });




//  docarray = docs.map((doc) => {
//     var tokens = az.Tokens(doc).done(['SPACE', 'PUNCT'], true )
//     //console.log(tokens)


//     az.Morph.init(async() => {
//         //console.log(az.Morph(tokens[0].toString()))

//         tokens.map((token) => {
//             try{
//                 buff.push(az.Morph(token.toString())[0].normalize(true).word)
//             }
//             catch (err) {console.log(err)}
//             docarray.push(buff)
//             buff.map(() => buff.shift)
//             //console.log(az.Morph(token.toString())[0].normalize(true).word)
//         });
//     })
//     docarray.push(buff)
//     console.log(buff)
//     buff.map(() => buff.shift)
//})
