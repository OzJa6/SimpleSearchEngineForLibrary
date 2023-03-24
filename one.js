const express = require('express')
const createError = require('http-errors')
const path = require('path');

const searchRouter = require('./components/search/searchRouter.js')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'components'))
app.set('view engine', 'pug')

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));

app.use('/search', searchRouter)

app.use(function(req,res,next){
    next(createError(404, 'NotFound'))
})

app.use(function(err,req,res, next) {


    console.error(err)
    res.locals.error = err.status || 500;
    res.locals.message = err.message || 'ServerError';
    res.status(err.status || 500);
    res.render('../views/error.pug')

})

app.listen(port, () => console.log('express started' + `on ${port}` + 'press ctrl+c'))

