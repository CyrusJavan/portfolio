const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const markdown = require('helper-markdown')
const MongoStore = require('connect-mongo')(session)

// Load Models
require('./models/User')
require('./models/Story')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories')

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

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs')

const app = express()


app.set('views', path.join(__dirname, './views'))
// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: './storybooks/views/layouts',
  partialsDir: './storybooks/views/partials',
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    markdown: markdown(),
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
  }
}))
app.set('view engine', 'handlebars')


// Cookie Parser middleware
//app.use(cookieParser('keyboard cat'))
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))


app.set('trust proxy', 1)
// Express Session middleware
app.use(session({
  name: 'storybooks',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    secure: false,
    sameSite: 'lax',
    httpOnly: false
  }
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars to be used in the UI
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// var port = process.env.PORT || 5000
// app.listen(port, () => {
//   console.log(`Server started on PORT:${port}`)
// })

// Use routes
app.use('/auth', auth)
app.use('/', index)
app.use('/stories', stories)

module.exports.app = app