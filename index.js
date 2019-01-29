const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 5000;

// Static folder
app.use(express.static(path.join(__dirname, 'vidjot/public')));

app.use('/vidjot', require('./vidjot/app').app);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});