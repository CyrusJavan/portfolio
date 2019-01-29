const express = require('express')
const path = require('path')
const app = express()
const exphbs = require('express-handlebars')
const port = process.env.PORT || 5000;

// Static folder
app.use(express.static(path.join(__dirname, 'vidjot/public')));

app.use('/vidjot', require('./vidjot/app').app);

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: 'views/portfolio/layouts',
  partialsDir: 'views/portfolio/partials'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});