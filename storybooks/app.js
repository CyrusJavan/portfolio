const express = require('express')
const mongoose = require('mongoose')

const app = express()


app.get('/', (req, res) => {
  res.send('success')
})

// var port = process.env.PORT || 5000
// app.listen(port, () => {
//   console.log(`Server started on PORT:${port}`)
// })

module.exports.app = app