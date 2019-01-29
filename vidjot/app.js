const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express();

// Load the routes
const ideas = require('./routes/ideas');
const users = require('./routes/users')

// Passport config
require('./config/passport')(passport);


// Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash middleware
app.use(flash());

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// // Static folder
// app.use(express.static(path.join(__dirname, 'public')));

// method override middleware
app.use(methodOverride('_method'));

//Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Connect to Mongoose
const db = require('./config/database')
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
}) 
  .then(() => {
    console.log('MongoDB Connected');
})
  .catch((err) => {
    console.log(err);    
  });

app.set('views', path.join(__dirname, '../views/vidjot'))

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'views/vidjot/layouts',
  partialsDir: 'views/vidjot/partials'
}));
app.set('view engine', 'handlebars');


// Index Route
app.get('/', (req, res) => {
  var title = "VidJot"
  res.render('index',{
    title: title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

// app.listen(port, () =>{
//   console.log(`Server started on port ${port}`);
// });
module.exports.app = app