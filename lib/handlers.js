

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
    const name = req.body.name || '', email = req.body.email || ''
    if (VALID_EMAIL_REGEX.test(email)) {
        res.locals.flash = {
            type: 'danger',
            intro: 'enter error',
            message: 'uncorrect email',
        }
        //return res.redirect(303, '/newsletter-signup')
    }
    console.log('form from link:' + req.query.form)
    console.log('token:' + req.body._csrf)
    console.log('name:' + req.body.name)
    console.log('email:' + req.body.email)
    new NewsLetterSignup({ name, email }).save(err)
        .then(() => {
            res.locals.flash = {
                type: 'success',
                intro: 'success',
                message: 'thx',
            }
            res.redirect(303, '/newsletter-archive')
        })
        .catch(err => {
            res.locals.flash = {
                type: 'danger',
                intro: 'error',
                message: 'db error',
            }
            res.redirect(303, '/newsletter-archive')
        })
}
exports.newsletterSignupThankYou = (req, res) => {
    res.render('newsletter-signup-thank-you')
}

exports.keywords = (req, res) => {
    res.render('keywords')
}