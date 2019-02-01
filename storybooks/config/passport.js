const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('./keys')

//Load user model
const User = mongoose.model('users-story')

module.exports = function(passport){
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: `${keys.domain}/storybooks/auth/google/callback`,
    passReqToCallback: true
    //proxy: true
  }, (request, accessToken, refreshToken, profile, done) => {
    // console.log(accessToken)
    // console.log(profile)
    process.nextTick(function()
  {
    var image = profile.photos[0].value
    image = image.substring(0, image.indexOf('?'))
    const newUser = {
      googleID: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      image:image
    }
    console.log(`Authenticating User ${newUser}`)
    // See if User has authenticated before
    User.findOne({
      googleID: newUser.googleID
    })
    .then(user => {
      if (user){
        // User already in db, authentication successful
        done(null, user)
      }
      else{
        // Create a new user
        new User(newUser)
        .save()
        .then(user => {
          done(null, user)
        })
      }
    })
  })
  })
  )
  // From Passport Docs
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user))
  })
}