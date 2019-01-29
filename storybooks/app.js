const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')

const app = express()


app.get('/', (req, res) => {
  res.send('success')
})

// var port = process.env.PORT || 5000
// app.listen(port, () => {
//   console.log(`Server started on PORT:${port}`)
// })

// Use routes
app.use('/auth', auth)

module.exports.app = app