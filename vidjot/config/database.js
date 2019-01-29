if (process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://cjavan:44Tanganyika!@ds115595.mlab.com:15595/vidjot-prod'
  }
}
else{
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}