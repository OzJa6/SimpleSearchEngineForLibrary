'use strict'

const az = require('az')
const invertedIndex = require('mnemonist/inverted-index')
const createError = require('http-errors')

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

module.exports.postSearch = (req, res) => {
    try {
        const name = req.body.name || ''
        var keywords = name.split(',')

        var docarray = new Array();
        var index = new invertedIndex()

        // var prom = new Promise((resolve, reject) => {
        //     setTimeout(() => resolve("done"), 1000);
        // })
        // prom.then(
        //     result => console.log("ya"),
        //     error => console.log('meh')
        // )

        let promisesDocs = docs.map((doc) => {
            return new Promise((resolve, reject) => {
                let tokens = az.Tokens(doc).done(['SPACE', 'PUNCT'], true)

                az.Morph.init(() => {
                    let buff = new Array();
                    tokens.map((token) => {
                        buff.push(az.Morph(token.toString())[0].normalize(true).word)
                    });
                    docarray.push(buff)
                    console.log(docarray);
                })

            })
        })
        //КОММЕНТ//
        //полулили массивы нормализованных слов для каждого названия.
        //теперь нужно сделать им TF-IDF
        //затем сделать значимым словам обратный индекс
        //КОММЕНТ//


        // let promisesArrivals = data.arrivals.map((arrival) => helper.replaceLink(arrival.WEB_FACE_OF_BOOK).then(result => {
        //     arrival.WEB_FACE_OF_BOOK = result;
        //     return arrival;
        // }));
        // data.arrivals = await Promise.all(promisesArrivals);
        res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 'bad' });
    }





}

function BuffAdd(buff) {
    return new Promise((resolve, reject) => {
        try {
            function fc() { buff.push('apple') }
            fc.then(() => resolve('yaaa'));
        }
        catch (err) { reject(err) }
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
