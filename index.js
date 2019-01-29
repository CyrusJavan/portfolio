const express = require('express')
const path = require('path')
const app = express()
const exphbs = require('express-handlebars')
const helmet = require('helmet')
const port = process.env.PORT || 5000;

// Static folder
app.use(express.static(path.join(__dirname, 'vidjot/public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/vidjot', require('./vidjot/app').app);

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'views/portfolio/layouts',
  partialsDir: 'views/portfolio/partials'
}));
app.set('view engine', 'handlebars');

// Helmet sets security HTTP headers
app.use(helmet())

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