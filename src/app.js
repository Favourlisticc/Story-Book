const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override')
const passport = require('passport')
const sessionstorybooks = require('express-session')
const mongoStore = require('connect-mongo')
require('./config/db')
require('./config/passport')(passport)
//routes

// Load confid 
dotenv.config({  path: './config/config.env'})

const app = express();

app.use(express.urlencoded( {extended: false} ))
app.use(express.json())

//method overiding
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))



//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//join views path for hbs
const viewspath = path.join(__dirname, './views')
console.log(viewspath)

//handlers helper
const { formatDate, truncate, stripTag, editIcon, select } = require('./helpers/hbs')

//handlers
app.engine('hbs',exphbs.engine({
    helpers: {
        formatDate,
        truncate,
        stripTag, 
        editIcon,
        select,
    },
    defaultLayout: 'main',
    extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', viewspath)

//session 
app.use(sessionstorybooks({
    secret: 'Lomoe',
    resave: false,
    saveUninitialized: false,
    store : mongoStore.create({
        mongoUrl: "mongodb+srv://favoursunday600:Favoursu@cluster0.ovy8rh1.mongodb.net/test"

      })
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//declaring a global variblre
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))
//Route

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//PORT
const PORT = 7000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} model on ${PORT}`))