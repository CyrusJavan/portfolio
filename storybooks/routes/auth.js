const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', function(req,res,next) {
  passport.authenticate('google', {scope: ['profile', 'email']})(req,res,next)
})

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/storybooks' }),
  (req, res) => {
    console.log(req.session)
    console.log(`googleCallback: ${req.user}`)
    console.log(`isAuthenticated:${req.isAuthenticated()}`)
    res.redirect('/storybooks/dashboard')
    // req.session.save((err) => {
    //   if (err) console.log(err)
    //   console.log(`Saving Session Err = ${err}`)
    //   res.redirect('/storybooks/dashboard');
    // })
  })

router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user)
  }
  else{
    console.log('NOt Auth')
  }
  res.redirect('/storybooks')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/storybooks')
})

module.exports = router;