module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }else{
      res.redirect('/storybooks')
    }
  },
  ensureGuest: function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/storybooks/dashboard')
    }else{
      return next();
    }
  }
}