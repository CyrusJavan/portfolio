const express = require('express')
const path = require('path')
const compression = require('compression')
const app = express()
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const port = process.env.PORT || 5000;


const db = require('./vidjot/config/database')
// Rate Limiting, connected to mongo to avoid having to hold the 
// list of incoming IPs in memory
const windowMs = 5 * 60 * 1000 // 5 minutes
var limiter = new RateLimit({
  store: new MongoStore({
    uri: db.mongoURI,
    collectionName: 'expressRateRecords',
    user: 'cjavan',
    password: '44Tanganyika!',
    expireTimeMs: windowMs
  }),
  max: 250,
  windowMs: windowMs,
  message: "Too many requests from this IP. This is just a demo app on a piece of free cloud space."
});

//app.use(limiter)

// Static folder
app.use(express.static(path.join(__dirname, 'vidjot/public')));
app.use(express.static(path.join(__dirname, 'public')));


// Helmet sets security HTTP headers
//app.use(helmet())

// Use gzip compresion to improve performance
//app.use(compression())

// Sub apps are used as middleware
app.use('/vidjot', require('./vidjot/app').app);
app.use('/storybooks', require('./storybooks/app').app);

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'views/portfolio/layouts',
  partialsDir: 'views/portfolio/partials'
}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
  res.render('portfolio/index')
})

app.get('/projects', (req, res) => {
  res.render('portfolio/projects')
})

app.get('*', function (req, res, next) {
  res.status(404).render('404')
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});