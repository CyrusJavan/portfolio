const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/storybooks' }),
  (req, res) => {
    console.log(req.session)
    req.session.save((err) => {
      if (err) console.log(err)
      res.redirect('/storybooks/dashboard');
    })
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