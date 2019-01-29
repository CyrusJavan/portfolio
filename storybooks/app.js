const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')

// Load Models
require('./models/User')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')
const index = require('./routes/index')

// Connect to Mongoose
const keys = require('./config/keys')
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
}) 
  .then(() => {
    console.log('StoryBooks:: MongoDB Connected');
})
  .catch((err) => {
    console.log(err);    
  });

const app = express()


app.set('views', path.join(__dirname, './views'))
// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: './storybooks/views/layouts'
}))
app.set('view engine', 'handlebars')

// Cookie Parser middleware
app.use(cookieParser())

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars to be used in the UI
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// var port = process.env.PORT || 5000
// app.listen(port, () => {
//   console.log(`Server started on PORT:${port}`)
// })

// Use routes
app.use('/auth', auth)
app.use('/', index)

module.exports.app = app