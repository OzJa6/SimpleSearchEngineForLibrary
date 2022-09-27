const az = require('az')
const invertedIndex = require('mnemonist/inverted-index')

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

exports.api = {}
exports.home = (req, res) => {
    res.render('home')
}

exports.about = (req, res) => {
    res.render('about', { fortune: fortune.getFortune() })
}

exports.headers = (req, res) => {
    res.type('text/plain')
    const headers = Object.entries(req.headers)
        .map(([key, value]) => `${key}: ${value}`)
    res.send(headers.join('\n'))
}

exports.NotFound = (req, res) => {
    ews.status(404)
    res.render('404')
}

exports.ServerError = (err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
}
//
// this handlers for submitted forms
//

//
// For fetch
//
exports.newsletter = (req, res) => {
    res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}

exports.api.newsletterSignup = (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.send({ result: 'success' })
}

//
// files
//
exports.vacationPhoto = (req, res) => {
    const now = new Date()
    res.render('contest/vacation-photo',
        { year: now.getFullYear(), month: now.getMonth() })
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
    console.log('fields: ' + fields.name + ' ' + fields.email)
    console.log('files: ' + files)
    res.redirect(303, '/')
}

//
//fetch
//



exports.api.vacationPhotoContest = (req, res, fields, file) => {
    console.log(fields)
    console.log(file)
    res.send({ result: 'success' })
}


//
// cookie
//

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

class NewsLetterSignup {
    constructor({ name, email }) {
        this.name = name
        this.email = email
    }
    async save() {
        //save to DBs
    }
}

exports.newsletterSignup = (req, res) => {
    res.render('newsletter-signup', { csrf: 'token CSRF' });
}

exports.newsletterSignupProcess = (req, res) => {

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
            let tokens = az.Tokens(doc).done(['SPACE', 'PUNCT'], true ) 
            
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






    res.redirect(303, '/')
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


exports.newsletterSignupThankYou = (req, res) => {
    res.render('newsletter-signup-thank-you')
}

exports.keywords = (req, res) => {
    res.render('keywords')
}

